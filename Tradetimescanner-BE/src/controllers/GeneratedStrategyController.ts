import { Request, Response } from 'express';
import { GeneratedStrategy } from '../models/GeneratedStrategy';

export const saveGeneratedStrategy = async (req: any, res: any) => {
    try {
        const {
            userid,
            strategyName,
            recommendedIndicators,
            recommendedtradetime,
            recommendedtimeframe,
            strategyexplanation,
            signal_annotation,
            originalIndicators,
            originalTradetime,
            originalTimeframe
        } = req.body;

        // Validate required fields
        if (!userid || !recommendedIndicators || !recommendedtradetime || !recommendedtimeframe || !strategyexplanation) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: userid, recommendedIndicators, recommendedtradetime, recommendedtimeframe, strategyexplanation'
            });
        }

        const strategy = await GeneratedStrategy.create({
            userid,
            strategyName: strategyName || `Strategy ${new Date().toISOString().split('T')[0]}`,
            recommendedIndicators,
            recommendedtradetime,
            recommendedtimeframe,
            strategyexplanation,
            signal_annotation: signal_annotation || [],
            originalIndicators: originalIndicators || '',
            originalTradetime: originalTradetime || '',
            originalTimeframe: originalTimeframe || ''
        });

        res.status(201).json({
            success: true,
            message: 'Strategy saved successfully',
            data: strategy.get({ plain: true })
        });
    } catch (err) {
        console.error('Error saving generated strategy:', err);
        res.status(500).json({
            success: false,
            message: 'Error saving strategy',
            error: err
        });
    }
};

export const getGeneratedStrategiesByUser = async (req: any, res: any) => {
    try {
        const { userid } = req.params;

        if (!userid) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const strategies = await GeneratedStrategy.findAll({
            where: { userid },
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            message: 'Strategies retrieved successfully',
            data: strategies.map(strategy => strategy.get({ plain: true }))
        });
    } catch (err) {
        console.error('Error fetching generated strategies:', err);
        res.status(500).json({
            success: false,
            message: 'Error fetching strategies',
            error: err
        });
    }
};

export const getGeneratedStrategyById = async (req: any, res: any) => {
    try {
        const { id } = req.params;

        const strategy = await GeneratedStrategy.findByPk(id);
        if (!strategy) {
            return res.status(404).json({
                success: false,
                message: 'Strategy not found'
            });
        }

        res.json({
            success: true,
            message: 'Strategy retrieved successfully',
            data: strategy.get({ plain: true })
        });
    } catch (err) {
        console.error('Error fetching generated strategy:', err);
        res.status(500).json({
            success: false,
            message: 'Error fetching strategy',
            error: err
        });
    }
};

export const updateGeneratedStrategy = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const strategy = await GeneratedStrategy.findByPk(id);
        if (!strategy) {
            return res.status(404).json({
                success: false,
                message: 'Strategy not found'
            });
        }

        await strategy.update(updateData);

        res.json({
            success: true,
            message: 'Strategy updated successfully',
            data: strategy.get({ plain: true })
        });
    } catch (err) {
        console.error('Error updating generated strategy:', err);
        res.status(500).json({
            success: false,
            message: 'Error updating strategy',
            error: err
        });
    }
};

export const deleteGeneratedStrategy = async (req: any, res: any) => {
    try {
        const { id } = req.params;

        const strategy = await GeneratedStrategy.findByPk(id);
        if (!strategy) {
            return res.status(404).json({
                success: false,
                message: 'Strategy not found'
            });
        }

        await strategy.destroy();

        res.json({
            success: true,
            message: 'Strategy deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting generated strategy:', err);
        res.status(500).json({
            success: false,
            message: 'Error deleting strategy',
            error: err
        });
    }
};

export const getAllGeneratedStrategies = async (req: Request, res: Response) => {
    try {
        const strategies = await GeneratedStrategy.findAll({
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            message: 'All strategies retrieved successfully',
            data: strategies.map(strategy => strategy.get({ plain: true }))
        });
    } catch (err) {
        console.error('Error fetching all generated strategies:', err);
        res.status(500).json({
            success: false,
            message: 'Error fetching strategies',
            error: err
        });
    }
};
