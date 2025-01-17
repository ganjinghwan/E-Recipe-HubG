import { Report } from '../models/Report.js';



export const fetchAllReports = async (req, res) => {
    try{
        const report = await Report.find({ });
        res.status(200).json({ success: true, data: report });
    }catch(error){
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}
