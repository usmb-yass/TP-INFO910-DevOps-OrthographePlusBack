import { CountriesModel } from '../models';
import Country from '#shared/types/Country';

export const countriesService = {
    async createCountry(data: Partial<Country>) {
        const country = new CountriesModel(data);
        return await country.save();
    },

    async getAllCountries() {
        return await CountriesModel.find().sort({ name: 1 }).collation({ locale: 'fr', strength: 1 }).lean();
    },

    async getCountryById(id: string) {
        return await CountriesModel.findById(id).lean();
    },

    async updateCountry(id: string, data: Partial<Country>) {
        return await CountriesModel.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true }).lean();
    },

    async deleteCountry(id: string) {
        return await CountriesModel.findByIdAndDelete(id).lean();
    }
};
