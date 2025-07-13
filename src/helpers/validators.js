/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import { curry, propEq, allPass, anyPass, count, countBy, equals, any,  compose, identity, toPairs, props } from 'ramda';
// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = ({ star, square, triangle, circle }) => {

    const isStar = propEq("star", 'red');
    const isSquare = propEq("square", 'green');
    const isWhite = curry((value, realValue) =>  propEq(realValue, value))("white");

    const isQueenOfSpades = allPass([isStar, isSquare, isWhite("triangle"), isWhite("circle")]);

    return isQueenOfSpades({ star, square, triangle, circle });

    // Вариант номер 2(чуть более короче)
    //const isWhite = curry((value, realValue) => { return equals(value, realValue)})("white");

    // return equals(star, 'red') && equals(square, 'green') && isWhite(triangle) && isWhite(circle);

};


// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = ({ star, square, triangle, circle }) => 
    count(equals("green"), [ star, square, triangle, circle ]) >= 2


// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = ({star, square, triangle, circle }) => {
    const colors = [star, triangle, square, circle];
    return equals(count(item => item === "red", colors), count(item => item === "blue", colors))
};

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = ({ star, square, circle }) => 
    allPass([
            propEq("circle", 'blue'), 
            propEq("star", 'red'), 
            propEq("square", 'orange')
        ])({ circle, square, star });


// 5. Три одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = compose(
    any(([color, count]) => color !== 'white' && count >= 3),
    toPairs,
    countBy(identity),
    props(['star', 'square', 'triangle', 'circle'])
);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная.
export const validateFieldN6 = ({ star, square, triangle, circle }) => {
    const colors = [star, square, triangle, circle];
    return (
        triangle === 'green' &&
        count(equals('green'), colors) === 2 &&
        count(equals('red'), colors) === 1
    );
};

const validateOneColor = ({ star, square, triangle, circle, color }) => {
    const isColor = curry((value, realValue) => { return propEq(realValue, value) })(color);
    return allPass([isColor("star"), isColor("square"), isColor("triangle"), isColor("circle")])({ star, square, triangle, circle });
}
// 7. Все фигуры оранжевые.
export const validateFieldN7 = ({ star, square, triangle, circle }) => 
    validateOneColor({ star, square, triangle, circle, color: "orange" });


// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = ({ star }) => 
    !anyPass([propEq("star", 'red'), propEq("star", 'white')])({ star });

// 9. Все фигуры зеленые.
export const validateFieldN9 = ({ star, square, triangle, circle }) =>
    validateOneColor({ star, square, triangle, circle, color: "green" })

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = ({ square, triangle }) => 
    allPass([
            propEq("triangle", triangle), 
            propEq("square", triangle)
        ])({ square, triangle });

