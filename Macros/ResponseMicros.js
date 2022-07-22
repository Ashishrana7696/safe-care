function response(app) {
    //Function expression
    app.response.success = function (data = [], statusCode = 200, message = "success") {
        // code is intentionally kept simple for demonstration purpose
        if (data.length === 0) {
            return this.status(statusCode).json({ 'success': true, 'message': message, 'code': statusCode })
        } else {
            return this.status(statusCode).json({ 'success': true, 'message': message, 'code': statusCode, 'data': data })
        }
    },

    app.response.routeNotFound = function (statusCode = 404, message = "Route Not Found") {
        // code is intentionally kept simple for demonstration purpose
        return this.status(statusCode).json({ 'success': false, 'message': message, 'code': statusCode })
    }

    app.response.failure = function (message = " Not Found", statusCode = 404) {
        // code is intentionally kept simple for demonstration purpose
        return this.status(statusCode).json({ 'success': false, 'message': message, 'code': statusCode })
    }
}


module.exports = { response }