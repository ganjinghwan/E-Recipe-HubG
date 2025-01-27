import { Report } from '../models/Report.js';
import mongoose from 'mongoose';



export const fetchAllReports = async (req, res) => {
    try{
        const report = await Report.find({ });
        res.status(200).json({ success: true, data: report });
    }catch(error){
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}


export const deleteReport = async (req, res) => {
    try {
        const {id} = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({ success: false, message: 'Invalid Report ID' });
        }
        await Report.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Report deleted successfully' });
    } catch (error) {
        console.log("Fail to delete report:", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};
