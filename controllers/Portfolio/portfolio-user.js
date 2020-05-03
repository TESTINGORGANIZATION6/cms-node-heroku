const schm = require('../../models/Portfolio/portfolio-users');
const User = require('../../portfolioDatabaseReg');

exports.getUsers = async (req, res) => {
    const users = await User.model('User', schm).aggregate([
        {
            '$project': {
                '_id': {
                    '$toString': '$_id'
                },
                'FirstName': 1,
                'LastName': 1,
                'ProfileStatus': 1,
                'UserName': 1
            }
        },
        {
            '$lookup': {
                'from': 'players',
                'localField': '_id',
                'foreignField': 'UserId',
                'as': 'details'
            }
        },
        {
            $unwind: "$details"
        },
        {
            $sort: { "details.updatedAt": -1 }
        },
        {
            '$project': {
                'FirstName': 1,
                'LastName': 1,
                'ProfileStatus': 1,
                'UserName': 1,
                'Role': '$details.Role',
                'Photo': '$details.Photo',
                'updatedAt': '$details.updatedAt',
                'UserId': '$details.UserId',
                'Email': '$details.Email',
                
            }
        },
    ]);
    res.send(users);
};


exports.changeUserStatus = async (req, res) => {
    const updateUser = await User.model('User', schm).updateOne(
        {
            _id: req.body.UserId
        },
        {
            $set: {
                ProfileStatus: req.body.Status
            }
        }
    );
    res.send({ updateUser: updateUser, message: 'User ' + ((req.body.Status) ? 'enabled.' : 'disabled.') })
}



