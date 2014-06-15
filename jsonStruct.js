/*jslint node: true, indent: 4 */
/* global module,console */
(function () {
    'use strict';

    function forEachBook(cntxt, func) {
        var books = cntxt.books,
            booksNum = cntxt.booksNum,
            i,
            ret,
            book;

        for (i = 0; i < booksNum; i += 1) {
            book = books[i];
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
    function size(cntxt) {
        // console.log('jsonStruct trace:' + cntxt.booksNum);
        return cntxt.booksNum;
    }
    function genJsonStruct(rowObj) {
        var cntxt = {},
            books = rowObj.books,
            len = rowObj.books.length,
            i;

        cntxt.books = books;
        for (i = 0; i < len; i += 1) {
            if (books[i].id === undefined) {
                cntxt.booksNum = i;
                break;
            }
        }

        return {
            size: size.bind(null, cntxt),
            forEachBook: forEachBook.bind(null, cntxt)
        };
    }

    module.exports = genJsonStruct;
}());
