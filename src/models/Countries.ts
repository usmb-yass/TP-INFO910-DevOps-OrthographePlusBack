import { Schema, model } from 'mongoose';
import Country from '#shared/types/Country';

const CountrySchema = new Schema<Country>({
  _id: { type: String, required: true },
  name: { type: String, required: true }
});

const CountriesModel = model<Country>('countries', CountrySchema);
export default CountriesModel;
