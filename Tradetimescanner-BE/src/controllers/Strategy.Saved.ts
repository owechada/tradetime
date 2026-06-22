import { Request, Response } from 'express';
import { SaveStrategy } from '../models/SaveStrategy';

export const createStrategy = async (req: any, res: any) => {
    try {
        const strategy = await SaveStrategy.create(req.body);
        res.status(201).json({ success: true, ...strategy.get({ plain: true }) });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Error creating strategy', err });
    }
};

export const getAllStrategies = async (_req: any, res: any) => {
    try {
        const strategies = await SaveStrategy.findAll();
        res.json({ success: true, data: [...strategies] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching strategies', err });
    }
};

export const getStrategyByUserId = async (req: any, res: any) => {
    try {
        const strategy = await SaveStrategy.findByPk(req.params.id);
        if (!strategy) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, ...strategy.get({ plain: true }) });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching strategy', err });
    }
};
export const getStrategyById = async (req: any, res: any) => {
    try {
        const strategy = await SaveStrategy.findByPk(req.params.id);
        if (!strategy) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, ...strategy.get({ plain: true }) });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching strategy', err });
    }
};

export const updateStrategy = async (req: any, res: any) => {
    try {
        const strategy = await SaveStrategy.findByPk(req.params.id);
        if (!strategy) return res.status(404).json({ success: false, message: 'Not found' });

        await strategy.update(req.body);
        res.json({ success: true, ...strategy.get({ plain: true }) });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Error updating strategy', err });
    }
};

export const deleteStrategy = async (req: any, res: any) => {
    try {
        const strategy = await SaveStrategy.findByPk(req.params.id);
        if (!strategy) return res.status(404).json({ success: false, message: 'Not found' });
        await strategy.destroy();
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error deleting strategy', err });
    }
};
