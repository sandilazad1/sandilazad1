const mongoose = require('mongoose');


const tempSchema = new mongoose.Schema({
  woodId: {
    type: String,
    required:true,
    unique:true
  },
  isDisabled:{
    type:Boolean,
    required:true,
    default:false
  },
  sensorData: {
		type: [{
			temp: {
				type: String,
				required: true,
			},
			date: {
				type: Date,
				required: true,
			}
		}],
		required: true
	},
});

const tempModel = mongoose.model('sensor', tempSchema);
module.exports = tempModel;


