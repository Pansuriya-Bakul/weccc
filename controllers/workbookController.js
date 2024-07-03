const Workbook = require('../models/workbook');
const Collection = require('../models/collection');
const User = require('../models/user');
const mongoose = require('mongoose');

// Create a new workbook
exports.create = async (req, res) => {
    try {
        const { name, collectionIds } = req.body;
        const userId = req.user._id; // Assuming you have user information in the request

        const collections = await Collection.find({ _id: { $in: collectionIds } });
        
        if (collections.length !== collectionIds.length) {
            return res.status(404).json({ message: 'One or more collections not found' });
        }

        const workbook = new Workbook({
            _id: new mongoose.Types.ObjectId(),
            name,
            collections: collectionIds,
            createdBy: userId,
            modifiedBy: userId
        });

        await workbook.save();
        res.status(201).json(workbook);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// View all workbooks
exports.readAll = async (req, res) => {
    try {
        const workbooks = await Workbook.find().populate('collections');
        res.status(200).json(workbooks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// View a single workbook by ID
exports.readById = async (req, res) => {
    try {
        const { workbookId } = req.params;
        const workbook = await Workbook.findById(workbookId).populate('collections');

        if (!workbook) {
            return res.status(404).json({ message: 'Workbook not found' });
        }

        res.status(200).json(workbook);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a workbook
exports.update = async (req, res) => {
    try {
        const { workbookId } = req.params;
        const { name, collectionIds } = req.body;
        const userId = req.user._id; // Assuming you have user information in the request

        const collections = await Collection.find({ _id: { $in: collectionIds } });
        
        if (collections.length !== collectionIds.length) {
            return res.status(404).json({ message: 'One or more collections not found' });
        }

        const workbook = await Workbook.findByIdAndUpdate(
            workbookId,
            { name, collections: collectionIds, modifiedBy: userId },
            { new: true }
        );

        if (!workbook) {
            return res.status(404).json({ message: 'Workbook not found' });
        }

        res.status(200).json(workbook);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a workbook
exports.delete = async (req, res) => {
    try {
        const { workbookId } = req.params;
        const workbook = await Workbook.findByIdAndDelete(workbookId);

        if (!workbook) {
            return res.status(404).json({ message: 'Workbook not found' });
        }

        res.status(200).json({ message: 'Workbook deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fetch workbooks created by a specific user
exports.getUserWorkbooks = async (req, res) => {
    try {
        const userId = req.params.userId; // Assuming userId is passed in the request params
        const workbooks = await Workbook.find({ createdBy: userId }).populate('collections');
        res.status(200).json(workbooks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Assign collections to users in a workbook
exports.assignCollectionsToUsers = async (req, res) => {
    try {
        const { workbookId, userIds } = req.body; // Assuming workbookId and userIds are passed in the request body

        // Find the workbook by ID
        const workbook = await Workbook.findById(workbookId);
        if (!workbook) {
            return res.status(404).json({ message: 'Workbook not found' });
        }

        // Fetch collections associated with the workbook
        const collections = await Collection.find({ _id: { $in: workbook.collections } });

        // Update each collection's memberList with new user IDs
        const updatePromises = collections.map(async (collection) => {
            collection.memberList.push(...userIds);
            await collection.save();
        });

        // Update each user's collectionList with new collection IDs
        const updateUserPromises = userIds.map(async (userId) => {
            const user = await User.findById(userId);
            if (user) {
                user.collectionList.push(...workbook.collections);
                await user.save();
            }
        });

        await Promise.all([...updatePromises, ...updateUserPromises]);

        res.status(200).json({ message: 'Collections assigned successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
