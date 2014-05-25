/*jslint node: true, indent: 4 */
/* global module,console */
(function () {
    'use strict';
    function forEachBook(rowObj, func) {
        var books = rowObj.books,
            booksSize = rowObj.books.length,
            book,
            i,
            ret;
        for (i = 0; i < booksSize; i += 1) {
            book = books[i];
            if (book.id === undefined) {
                break;
            }
            ret = func({
                id: book.id,
                isbn: book.asin,
                title: book.title,
                author: book.author
            });
            if (ret === false) {
                break;
            }
        }
    }
    module.exports = function (rowObj) {
        return {
            forEachBook: forEachBook.bind(null, rowObj)
        };
    };
}());
