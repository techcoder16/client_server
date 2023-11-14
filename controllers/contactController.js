const Contact = require("../models/Contact");
const fastcsv = require('fast-csv');
const fs = require('fs');


const xlsx = require('xlsx');
const { Readable } = require('stream');



// const getContact = async (req, res) => {
//   try {
//     const contact = await Contact.find({});

//     if (!contact) {
//       return res.status(401).json({ message: "No Contact Found" });
//     } else {
//       res.json({ message: "Successfully Get All Contacts", contact });
//     }
//   } catch (err) {
//     console.log(err);
//     return res.status(401).json({ message: "Contact Error" });
//   }
// };




const getContact = async (req, res) => {
  try {
    
    const page = JSON.parse(req.params.payload);


    

    const limit = parseInt(req.query.limit) || 100;

    const skip = (page.page - 1) * limit;
    

    const explainResult = await Contact.find({}).explain();

    const query = {};

    if (page.selectedFilters.website !== "" &&   page.selectedFilters.website) {
      query.website = page.selectedFilters.website;
    }
    if (page.selectedFilters.companyName !== "" && page.selectedFilters.companyName) {
      query.companyName = page.selectedFilters.companyName;
    }
    if (page.selectedFilters.industry !== "" && page.selectedFilters.industry){
      query.industry = page.selectedFilters.industry;
    }

    if (page.selectedFilters.industry2 !== "" && page.selectedFilters.industry2) {
      query.industry2 = page.selectedFilters.industry2;
    }

    if (page.selectedFilters.Country !== "" && page.selectedFilters.Country) {
      query.Country = page.selectedFilters.Country;
    }

    
    if (page.selectedFilters.Region !== "" && page.selectedFilters.Region) {
      query.Region = page.selectedFilters.Region;
    }
    
    if (page.selectedFilters.name !== "" && page.selectedFilters.name) {
      query.name = page.selectedFilters.name;
    }

    if (page.searchQuery !== "") {
      query.name = { $regex: page.searchQuery, $options: "i" };
    }


    


    const contact = await Contact.find(query).skip(skip).limit(limit);

    const contactCount = await Contact.countDocuments(query);
  
 
    res.status(200).send({ contact, contactCount });

  } catch (error) {

    res

      .status(500)
      .json({ error: "An error occurred while retrieving products" });
  }
};






const updateContact = async ()=>{

      
  const aggregatePipeline = await Contact.aggregate([
    {
      $group: {
        _id: "$email",
        count: { $sum: 1 },
        docs: { $push: "$_id" }
      }
    },
    {
      $unwind: "$docs"
    },
    {

      $project: {
        _id: 0,
        id: "$docs",
        duplicate: {
          $cond: {
            if: { $eq: ["$count", 1] },
            then: false, 
            else: true
          }
        }
      }
    }
  ]);


  try
  {
  for (const doc of aggregatePipeline) {
    console.log(doc)

    await Contact.updateOne({ _id: doc.id }, { $set: { duplicate: doc.duplicate } });
  }
}
catch (err)
{
  console.log("ASdasd",err);
}
  
  
}

const createContact = async (req, res) => {
  const {
    date,

    name,

    website,

    industry1,

    industry2,

    empcount,

    phoneNumber,
    linkedin,
    city,
    region,
    country,
    firstName,
    lastName,

    jobRole,
    email,
    remarks,
  } = req.body;

  try {
    if (
   
      name == "" ||
      website == "" ||
      industry1 == "" ||
      industry2 == "" ||
      empcount == "" ||
      phoneNumber == "" ||
      linkedin == "" ||
      city == "" ||
      region == "" ||
      country == "" ||
      firstName == "" ||
      lastName == "" ||
      jobRole == "" ||
      email == "" || 
      remarks == ""
    ) {
      res.status(401).send({ message: "Field Empty!" });
      return;
    }
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
let dateNew =      today.toISOString();


    console.log(timeElapsed.toString());
    const contact = Contact.create({
      dateNew,

      name,

      website,

      industry1,

      industry2,

      empcount,

      phoneNumber,
      linkedin,
      city,
      region,
      country,
      firstName,
      lastName,

      jobRole,
      email,
      remarks,
    });

    
    console.log({date,

      name,

      website,

      industry1,

      industry2,

      empcount,

      phoneNumber,
      linkedin,
      city,
      region,
      country,
      firstName,
      lastName,

      jobRole,
      email,
      remarks,
    })

    
   await updateContact();

    res.status(200).send({ message: "Contact Created!" });
  } catch (error) {
    console.log("ASdad",error);
  }
};
const updateContactbyID = async (req, res) => {
  const {  date,

    name,

    website,

    industry1,

    industry2,

    empcount,

    phoneNumber,
    linkedin,
    city,
    region,
    country,
    firstName,
    lastName,

    jobRole,
    email,
    remarks,
  id } = req.body;
  try {
    const filter = { _id: id };

    const contact = await Contact.findOneAndUpdate(filter, {
      date,

      name,

      website,

      industry1,

      industry2,

      empcount,

      phoneNumber,
      linkedin,
      city,
      region,
      country,
      firstName,
      lastName,

      jobRole,
      email,
      remarks,
    });

    console.log(remarks);

    await updateContact();

    res.status(200).send({ message: "Contact Updated!", Contact: contact });
  } catch (error) {
    console.log(error);
  }
};
const getIdbyName = async (req, res) => {
  const { Contact_name } = req.params;

  try {
    const Contact = await Contact.findOne({ Contact_name: Contact_name });

    if (Contact) {
      res.status(200).send({ id: Contact.id, _id: Contact._id });
    } else {
      res.status(201).send({ id: "", _id: "" });
    }
  } catch (error) {
    res.status(201).send({ id: "", _id: "" });
  }
};

const getContactbyBasicId = async (req, res) => {
  const { ID } = req.params;
  try {
    const Contact = await Contact.findOne({ _id: ID });

    if (Contact) {
      res
        .status(200)
        .send({ Contact_name: Contact.Contact_name, _id: Contact._id });
    } else {
      res.status(201).send({ Contact_name: "", _id: "" });
    }
  } catch (error) {
    res.status(201).send({ Contact_name: "", _id: "" });
  }
};

const getContactbyId = async (req, res) => {
  const { ID } = req.params;
  try {
    const Contact = await Contact.findOne({ id: ID });

    if (Contact) {
      res
        .status(200)
        .send({ Contact_name: Contact.Contact_name, _id: Contact._id });
    } else {
      res.status(201).send({ Contact_name: "", _id: "" });
    }
  } catch (error) {
    res.status(201).send({ Contact_name: "", _id: "" });
  }
};






const getAllContacts = async (req, res) => {
  const { ID } = req.params;
  
  try {
    const Contact = await Contact.find(
      {
        $and: [{ id: { $ne: ID } }],
      },
      { Contact_name: 1, _id: 1 }
    );

    if (Contact) {
      res.status(200).send({ Contact });
    } else {
      res.status(201).send({ message: "No Contact Added" });
    }
  } catch (error) {
    res.status(201).send({ message: "No Contact Added" });
  }
};

const deleteContactById = async (req, res) => {
  const { ID } = req.body;
 
  try {
    let contact = Contact.findOneAndRemove({ _id: ID })
      .then((element) => {
        console.log("Contact deleted:", element);
      })
      .catch((error) => {
        console.error("Error deleting Contact:", error);
      });

       await updateContact();
    res.status(200).send({ message: "Contact Deleted!" });
  } catch (error) {
    console.log(error);
    res.status(401).send({ message: "Contact Cannot be Deleted!" });
  }
};

const getAllFilters = async (req, res) => {




  const website = await Contact.distinct("website");
  
  const companyName = await Contact.distinct("companyName");
  
  const industry = await Contact.distinct("industry");
  const industry2 = await Contact.distinct("industry2");
  const Country = await Contact.distinct("Country");
  const Region = await Contact.distinct("Region");
  const companyLinkedIn = await Contact.distinct("companyLinkedIn");
  const name = await Contact.distinct("name");



  res.status(200).send({ message: "Contact filters ",name,website,companyName,industry,industry2,Country,Region,companyLinkedIn });

  




};



const upliftData = async (req, res) => {

  const file = req.file;

  console.log(file);
  const { data } = req.body;

  
  try {
   




        // try {
      //     const contact = await Contact.create({
      //       name :element[0],
      //       wesbite: element[1],
      //       industry1: element[2],
      //      industry2:  element[3],
      //       empcount: element[4],
      //       phoneNumber : element[5],
      //       linkedin: element[6],
      //      city: element[7],
      //      region: element[8],
      //      country: element[9],
      //      firstName: element[10],
      //      lastName: element[11],
      //      jobRole: element[12],
        
      //       duplicate:false,

      //     }
            
            
      //     );
      //     await updateContact();

      //   } catch (error) {}
      // })


console.log(file.destination+file.filename);



const workbook = xlsx.readFile(file.destination+file.filename);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const stream = xlsx.stream.to_json(worksheet);

  const readableStream = new Readable({ objectMode: true });
  readableStream._read = () => {};
  stream.on('data', (data) => readableStream.push((data)));
  stream.on('end', () => readableStream.push(null));


  const writableStream = Contact.collection.initializeOrderedBulkOp();

  
  function removeEmptyProperties(data) {
    // Filter out properties with empty values
    return Object.keys(data)
      .filter(key => data[key] !== '')
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});
  }
  
  

  readableStream.on('data', async (data) => {
    try {
      // Perform any additional data processing if needed
      
      console.log(data);
      const newaa = [
        data['__EMPTY'],
    
    data['__EMPTY_1'],
    data['__EMPTY_2'],
    
    data['__EMPTY_3'],
    data['__EMPTY_4'],
    
    data['__EMPTY_5'],
    data['__EMPTY_6'],
    data['__EMPTY_7'],
    data['__EMPTY_8'],
    data['__EMPTY_9'],
    data['__EMPTY_10'],
    data['__EMPTY_11'],
    data['__EMPTY_12'],
    
    data['__EMPTY_13'],
    data['__EMPTY_19'],
    data['__EMPTY_20'],
    data['__EMPTY_21'],
    data['__EMPTY_22'],

    
    ]


    const obj = newaa.reduce((acc, value, index) => {
      acc[index] = value;
      return acc;
    }, {});
    

    

    console.log(obj)

// const newdata = [data['_E']]




    const document = new Contact({
      name: newaa[0],
      industry1:  newaa[1],
      
      
      industry2:  newaa[2],

      jobRole:  newaa[2],
    
      phoneNumber:  newaa[4],
      city:  newaa[5],
      region:  newaa[6],
      country:  newaa[7],
      
      
      
      website:  newaa[8],
      
      empcount:  newaa[11],
    
      industry2:  newaa[10],
      
      
      linkedin:  newaa[13],
      
      date:  newaa[12],

      email:  newaa[14],
      
      remarks: newaa[15],
    
      firstName:  newaa[16],
      lastName:  newaa[17],
    
    }

      

    );
    

     console.log('Mongoose Document:', document.toObject());
        

       writableStream.insert(document.toObject());

    } catch (error) {
      console.error('Error processing data:', error);
    }
  });



  readableStream.on('end', async () => {
    try {
      // Execute the bulk insert
      await writableStream.execute();
      console.log('Upload complete. Closing MongoDB connection.');
      
    } catch (error) {
      console.error('MongoDB stream error:', error);
    }
  });




  

      res.status(200).send({ message: "Contact Uplift Successfully!" });
    
  } catch (err) {
    res.status(401).send({ message: "Contact Uplift Failed!" });
  }

  
};

module.exports = {
  getContact,
  createContact,
  updateContactbyID,
  deleteContactById,
  getContactbyId,
  getAllContacts,
  getIdbyName,
  getContactbyBasicId,

  getAllFilters,

  upliftData,
};
