import { Request, Response } from 'express';
import { ChangeDetectionService } from '../services/ChangeDetectionService';
import { AuthRequest } from '../middleware/auth.js';

const changeDetectionService = new ChangeDetectionService();

export const detectChanges = async (req: AuthRequest, res: Response) => {
  try {
    const { bounds, beforeDate, afterDate } = req.body;

    if (!bounds || !beforeDate || !afterDate) {
      return res.status(400).json({
        error: 'Missing required parameters: bounds, beforeDate, afterDate'
      });
    }

    // Validate bounds format
    if (!Array.isArray(bounds) || bounds.length !== 4) {
      return res.status(400).json({
        error: 'Bounds must be an array of 4 numbers [minX, minY, maxX, maxY]'
      });
    }

    const result = await changeDetectionService.detectChanges(
      bounds as [number, number, number, number],
      beforeDate,
      afterDate
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Change detection error:', error);
    res.status(500).json({
      error: 'Failed to perform change detection',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getChangeHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;

    // In a real implementation, you would fetch from database
    res.json({
      success: true,
      data: {
        projectId,
        changes: [],
        total: 0
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch change history',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};