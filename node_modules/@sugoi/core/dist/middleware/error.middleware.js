//
//
//
// export const errorHandler = (development: boolean = true) => {
//     return (err: Error, req, res, next) => {
//
//         if (development) {
//             console.error(err);
//         }
//
//         if (typeof err['type'] !== 'undefined' && err['type'] === ErrorTypes.CLIENT_DATA_ERROR) {
//             res.status(400).json(new ErrorMessage(400, err.message));
//         } else if (err['status']) {
//             res.status(err['status']).json(new ErrorMessage(err['status'], err.message));
//         } else {
//             res.status(500).json(new ErrorMessage(500, err.message));
//         }
//         return next();
//     }
// };
