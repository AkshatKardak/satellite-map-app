import mongoose, { Schema, Document } from 'mongoose';

export interface IFeature {
  type: 'Point' | 'LineString' | 'Polygon';
  coordinates: any[];
  properties: Record<string, any>;
}

export interface IProject extends Document {
  name: string;
  description: string;
  features: IFeature[];
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  bounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
}

const FeatureSchema = new Schema({
  type: { type: String, enum: ['Point', 'LineString', 'Polygon'], required: true },
  coordinates: { type: Schema.Types.Mixed, required: true },
  properties: { type: Schema.Types.Mixed, default: {} }
});

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  features: [FeatureSchema],
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bounds: {
    minX: Number,
    minY: Number,
    maxX: Number,
    maxY: Number
  }
}, {
  timestamps: true
});

// Spatial index for efficient queries
ProjectSchema.index({ 'bounds': '2dsphere' });
ProjectSchema.index({ 'owner': 1, 'createdAt': -1 });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);