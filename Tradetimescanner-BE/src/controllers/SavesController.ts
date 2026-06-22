import { Request, Response } from "express";
import { SavedScans } from "../models/SavedScans";

// Function to save a new scan
const SaveScan = async (req: Request, res: Response) => {
  const { market, endtime, starttime, timezone, date, content, userid } = req.body;
  try {
    await SavedScans.create({
      market,
      endtime,
      starttime,
      timezone,
      userid,
      date,
      content,
    });
    res.status(200).json({ message: "Saved" });
  } catch (e: any) {
    res.status(500).json({ message: "Internal server error", error: e });
  }
};

// Function to delete a scan by ID
const DeleteScanById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await SavedScans.destroy({
      where: { id },
    });
 

    res.status(200).json({ message: "Deleted successfully" });
  } catch (e: any) {
    res.status(500).json({ message: "Internal server error", error: e });
  }
};

// Function to get scans by User ID
const GetuserScans = async (req: Request, res: Response) => {
    const { userid } = req.body;
    try {
        const scans = await SavedScans.findAll({
            where: { userid },
          });
      
       
      
          res.status(200).json(scans);
    } catch (e: any) {
      res.status(500).json({ message: "Internal server error", error: e });
    }
};

export { SaveScan, DeleteScanById, GetuserScans };
