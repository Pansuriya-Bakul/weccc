const Workbook = require('../models/workbook');
const Collection = require('../models/collection');
const User = require('../models/user');
const axios = require('axios');
const mongoose = require('mongoose');
const memberSurvey = require('../models/memberSurvey');
const memberCollection = require('../models/memberCollection');

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

const { create } = require('./memberCollectionController');

exports.assignCollectionsToUsers = async (req, res) => {
    try {
        const { workbookId, userIds } = req.body; // Changed to workbookIds
        const createdBy = '60e1f2bd08fa9904cc62cdf6';

        // Ensure workbookIds is an array
        if (!Array.isArray(workbookId)) {
            return res.status(400).json({ message: 'workbookIds should be an array' });
        }

        // To capture errors
        const errors = [];
        const promises = [];

        // Process each workbook
        for (const _Id of workbookId) {
            const workbook = await Workbook.findById(_Id);
            if (!workbook) {
                errors.push(`Workbook with ID ${workbookId} not found`);
                continue; 
            }

            const collections = workbook.collections; // Fetch collections associated with the workbook

            // Process each user and collection
            for (const userId of userIds) {
                for (const collectionId of collections) {
                    // Prepare req object for create function
                    const reqForCreate = {
                        body: {
                            collectionTemplate: collectionId,
                            member: userId,
                            createdBy: createdBy
                        }
                    };

                    // Capture the result or error of create function
                    promises.push(new Promise((resolve, reject) => {
                        const resMock = {
                            status: (statusCode) => ({
                                json: (data) => {
                                    if (statusCode >= 400) {
                                        reject(new Error(data.message || 'Error occurred'));
                                    } else {
                                        resolve(data);
                                    }
                                }
                            })
                        };
                        create(reqForCreate, resMock);
                    }).catch(error => {
                        errors.push(`Failed for userId ${userId} and collectionId ${collectionId} in workbookId ${workbookId}: ${error.message}`);
                    }));

                    // Optionally update the collection's member list
                    promises.push(Collection.findByIdAndUpdate(collectionId, { $addToSet: { memberList: userId } }).exec());

                    // Optionally update each user's collection list
                    promises.push(User.updateOne({ _id: userId }, { $addToSet: { collectionList: collectionId } }).exec());
                }
            }
        }

        // Wait for all promises to complete
        await Promise.all(promises);

        if (errors.length > 0) {
            res.status(500).json({ message: 'Some collections could not be assigned.', errors });
        } else {
            res.status(200).json({ message: 'Collections assigned successfully' });
        }
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ message: error.message });
    }
};
