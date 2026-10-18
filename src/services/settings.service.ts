import { SettingsModel } from '../models';
import Setting from '#shared/types/Setting';

export const settingsService = {
    async getAllSettings() {
        return await SettingsModel.find();
    },

    async getSettingById(id: string) {
        return await SettingsModel.findById(id);
    },

    async updateSetting(id: string, data: Partial<Setting>) {
        // Mongoose handled timestamps automatically so no need for data.updatedAt = new Date() if we have timestamps: true
        return await SettingsModel.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true });
    }
};
