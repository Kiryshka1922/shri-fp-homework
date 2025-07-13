/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import {
    compose, __, allPass, gt, lt, length, test,
    andThen,
    otherwise,
} from 'ramda';

const api = new Api();

const isValidNumber = allPass([
    test(/^[0-9.]+$/),
    compose(gt(__, 2), length),
    compose(lt(__, 10), length),
    compose(gt(__, 0), parseFloat)
]);

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
    const roundValue = (value) => Math.round(parseFloat(value));
    const error = (obj) => {
        if (obj.status && obj.status !== "STOP"){
            handleError(obj.message);
            return Promise.reject({status: "STOP"});
        }
        else{
            return;
        }
    };
    const write = (val = value) => { writeLog(val); return val }
    
    const request_1 = (roundedValue) => api.get('https://api.tech/numbers/base', {
        from: 10,
        to: 2,
        number: roundedValue
    });
    
    const request_2 = (roundedValue) => {
        console.log(roundedValue)
        return api.get(`https://animals.tech/${roundedValue}`, {})
    };

    const comp = compose(
        otherwise(error),
        andThen(({result}) => {
            handleSuccess(result);
        }),
        andThen(request_2),
        andThen(squared => write(squared % 3)),
        andThen(length => write(length ** 2)),
        andThen(result => write(result.length)),
        otherwise((err) => error({message: err, status:"continue"})),
        andThen(({result}) => write(result)),
        request_1,
        write,
        roundValue,
    );

    write();

    if (isValidNumber(value)) {
        comp(value);
    }
    else{
        handleError("ValidationError");
        return;
    }
};

export default processSequence;