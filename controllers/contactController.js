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
    if (page.selectedFilters.name !== "" && page.selectedFilters.name) {
      query.name = page.selectedFilters.name;
    }
    if (page.selectedFilters.industry1 !== "" && page.selectedFilters.industry1){
      query.industry1 = page.selectedFilters.industry1;
    }

    if (page.selectedFilters.industry2 !== "" && page.selectedFilters.industry2) {
      query.industry2 = page.selectedFilters.industry2;
    }

    if (page.selectedFilters.country !== "" && page.selectedFilters.country) {
      query.country = page.selectedFilters.country;
    }
 
    if (page.selectedFilters.date !== "" && page.selectedFilters.date) {
      query.date = page.selectedFilters.date;
    }
    
    if (page.selectedFilters.region !== "" && page.selectedFilters.region) {
      query.region = page.selectedFilters.region;
    }
    
    if (page.selectedFilters.result !== "" && page.selectedFilters.result) {
      query.result = page.selectedFilters.result;
    }
    if (page.selectedFilters.free !== "" && page.selectedFilters.free) {
      query.free = page.selectedFilters.free;
    }
    if (page.selectedFilters.role !== "" && page.selectedFilters.role) {
      query.role = page.selectedFilters.role;
    }
    if (page.selectedFilters.quality !== "" && page.selectedFilters.quality) {
      query.quality = page.selectedFilters.quality;
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
    industry1,
    industry2,
    empcount,
    phoneNumber,
    website,
    companyLinkedin,
    city,
    region,
    country,
    firstName,
    lastName,
    jobRole,
    email,
    quality,
    result,
    free,
    role,
    phoneNumber2,
    linkedin,
    remarks,
    recordMarksheet,

    
  } = req.body;

  try {
    if (
   
   
    name ==  "" ||
    industry1 ==  "" ||
    industry2 ==  "" ||
    empcount ==  "" ||
    phoneNumber ==  "" ||
    website ==  "" ||
    companyLinkedin ==  "" ||
    city ==  "" ||
    
    country ==  "" ||
    firstName ==  "" ||
    lastName ==  "" ||
    jobRole ==  "" ||
    email ==  "" ||
    quality ==  "" ||
    result ==  "" ||
    free ==  "" ||
    role ==  "" ||
    phoneNumber2 ==  "" ||
    linkedin ==  "" ||
    remarks ==  "" ||
    recordMarksheet ==  "" 
    


    ) {
      console.log({date,
        name,
        industry1,
        industry2,
        empcount,
        phoneNumber,
        website,
        companyLinkedin,
        city,
        region,
        country,
        firstName,
        lastName,
        jobRole,
        email,
        quality,
        result,
        free,
        role,
        phoneNumber2,
        linkedin,
        remarks,
        recordMarksheet,}

      )
      res.status(401).send({ message: "Field Empty!" });
      return;
    }
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
let dateNew =      today.toISOString();


    console.log(timeElapsed.toString());
    const contact = Contact.create({
      date,
    name,
    industry1,
    industry2,
    empcount,
    phoneNumber,
    website,
    companyLinkedin,
    city,
    region,
    country,
    firstName,
    lastName,
    jobRole,
    email,
    quality,
    result,
    free,
    role,
    phoneNumber2,
    linkedin,
    remarks,
    recordMarksheet,
    
    });

    
   await updateContact();

    res.status(200).send({ message: "Contact Created!" });
  } catch (error) {
    console.log("ASdad",error);
  }
};
const updateContactbyID = async (req, res) => {
  const {  
    
    date,
    name,
    industry1,
    industry2,
    empcount,
    phoneNumber,
    website,
    companyLinkedin,
    city,
    region,
    country,
    firstName,
    lastName,
    jobRole,
    email,
    quality,
    result,
    free,
    role,
    phoneNumber2,
    linkedin,
    remarks,
    recordMarksheet,
    
  id } = req.body;
  try {
    const filter = { _id: id };

    const contact = await Contact.findOneAndUpdate(filter, {
      
      date,
      name,
      industry1,
      industry2,
      empcount,
      phoneNumber,
      website,
      companyLinkedin,
      city,
      region,
      country,
      firstName,
      lastName,
      jobRole,
      email,
      quality,
      result,
      free,
      role,
      phoneNumber2,
      linkedin,
      remarks,
      recordMarksheet,
      
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
  
  const companyName = await Contact.distinct("name");
  
  const industry = await Contact.distinct("industry1");
  const industry2 = await Contact.distinct("industry2");
  const Country = await Contact.distinct("country");
  const Region = await Contact.distinct("region");
  const companyLinkedIn = await Contact.distinct("companyLinkedin");
  const name = await Contact.distinct("name");

  const role = await Contact.distinct("role");
  const result = await Contact.distinct("result");
  const quality = await Contact.distinct("quality");
  const free = await Contact.distinct("free");

  const date = await Contact.distinct("date");

  console.log(date);

  res.status(200).send({ message: "Contact filters ",name,website,companyName,industry,industry2,Country,Region,companyLinkedIn,role, quality, free,result,date});

  




};



const upliftData = async (req, res) => {

  const file = req.file;

  if(!file)
  {

    console.log("hahaah",file);
   return res.status(401).send({ message: "Empty File" });
      
   
console.log("asdasdad");
  }

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
      
  
      const newaa = Object.values(data)


    const obj = newaa.reduce((acc, value, index) => {
      acc[index] = value;
      return acc;
    }, {});
    

  
const document = new Contact({ srno: newaa [0],
   date:newaa[1],
   name: newaa[2],
   industry1: newaa[3],
   industry2:newaa[4],
   empcount: newaa[5],
   phoneNumber: newaa[6],
   website: newaa[7],
   companyLinkedin: newaa[8],
   city:   newaa[9],
   country: newaa[10],
   firstName: newaa[11],
   lastName: newaa[12],
   jobRole:   newaa[13],
   email: newaa[14],
   quality:  newaa[15],
   result:  newaa[16],
   free: newaa[17],
   role: newaa[18],
   phoneNumber2: newaa[19],
    recordMarksheet : newaa[20]
  });






// const newdata = [data['_E']]




    // const document = new Contact({
    //   name: newaa[0],
    //   industry1:  newaa[1],
      
      
    //   industry2:  newaa[2],

    //   jobRole:  newaa[2],
    
    //   phoneNumber:  newaa[4],
    //   city:  newaa[5],
    //   region:  newaa[6],
    //   country:  newaa[7],
      
      
      
    //   website:  newaa[8],
      
    //   empcount:  newaa[11],
    
    //   industry2:  newaa[10],
      
      
    //   linkedin:  newaa[13],
      
    //   date:  newaa[12],

    //   email:  newaa[14],
      
    //   remarks: newaa[15],
    
    //   firstName:  newaa[16],
    //   lastName:  newaa[17],
    
    // }

      

    // );
    


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
      res.status(401).send({ message: "Failed to add Data!" });

    
      
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
