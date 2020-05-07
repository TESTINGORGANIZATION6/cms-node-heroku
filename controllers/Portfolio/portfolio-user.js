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
                'UserName': 1,
                'Email': 1
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
            $unwind: {
                path: "$details",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $match: {
                $or:
                    [{ FirstName: { $regex: '.*' + req.body.search_txt + '.*', $options: 'i' } },
                    { LastName: { $regex: '.*' + req.body.search_txt + '.*', $options: 'i' } },
                    { UserName: { $regex: '.*' + req.body.search_txt + '.*', $options: 'i' } },
                    ]
            }
        },
        {
            $sort: { "details.updatedAt": -1 }
        },
        {
            '$facet': {
                pagination: [
                    { $count: "total" },
                    {
                        $addFields:
                            { page_no: req.body.page_no, toal_pages: { $ceil: { $divide: ["$total", req.body.max_per_page] } } }
                    }],
                data: [
                    { $skip: req.body.max_per_page * (req.body.page_no - 1) },
                    { $limit: req.body.max_per_page },
                    {
                        '$project': {
                            'FirstName': 1,
                            'LastName': 1,
                            'ProfileStatus': 1,
                            'UserName': 1,
                            'Email': 1,
                            'Role': { $cond: { if: { $isArray: "$details" }, then: '$details.Role', else: "" } },
                            'Photo': { $cond: { if: { $isArray: "$details" }, then: '$details.Photo', else: "" } },
                            'updatedAt': { $cond: { if: { $isArray: "$details" }, then: '$details.updatedAt', else: "" } },
                            'UserId': { $cond: { if: { $isArray: "$details" }, then: '$details.UserId', else: "" } }
                        },
                    }]
            }
        }
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



