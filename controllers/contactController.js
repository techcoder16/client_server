const Contact = require("../models/Contact");
const fastcsv = require("fast-csv");
const fs = require("fs");

const xlsx = require("xlsx");
const { Readable } = require("stream");

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
    console.log(req.params);

    // Safely parse `page` from `req.params`
    let page;
    try {
      page = JSON.parse(req.params.page) || {};
    } catch (e) {
      page = {};
    }

    // Default pagination values
    const limit = parseInt(req.query.limit, 10) || 10;
    const currentPage = page.page || 1;
    const skip = (currentPage - 1) * limit;

    // Initialize query object
    const query = {};

    // Ensure `selectedFilters` is defined
    const selectedFilters = page.selectedFilters || {};

    // Populate query with selected filters
    if (selectedFilters.website) {
      query.website = selectedFilters.website;
    }
    if (selectedFilters.name) {
      query.name = selectedFilters.name;
    }
    if (selectedFilters.industry1) {
      query.industry1 = selectedFilters.industry1;
    }
    if (selectedFilters.industry2) {
      query.industry2 = selectedFilters.industry2;
    }
    if (selectedFilters.country) {
      query.country = selectedFilters.country;
    }
    if (selectedFilters.date) {
      query.date = selectedFilters.date;
    }
    if (selectedFilters.region) {
      query.region = selectedFilters.region;
    }
    if (selectedFilters.result) {
      query.result = selectedFilters.result;
    }
    if (selectedFilters.free) {
      query.free = selectedFilters.free;
    }
    if (selectedFilters.role) {
      query.role = selectedFilters.role;
    }
    if (selectedFilters.quality) {
      query.quality = selectedFilters.quality;
    }
    if (selectedFilters.companyName) {
      query.name = selectedFilters.companyName;
    }
    
    // Handle search query
    if (page.searchQuery) {
      query.name = { $regex: page.searchQuery, $options: "i" };
    }

    // Handle `empcount` filtering
    if (selectedFilters.empcount) {
      const [lowerLimit, upperLimit] = selectedFilters.empcount.split('-').map(Number);
      if (!isNaN(lowerLimit) && !isNaN(upperLimit)) {
        query.empcount = { "$gt": lowerLimit, "$lt": upperLimit };
      } else {
        console.error("Invalid empcount values detected");
      }
    }

    // Fetch data from the database
    const contacts = await Contact.find(query).skip(skip).limit(limit);
    const contactCount = await Contact.countDocuments(query);

    // Send response
    res.status(200).json({ contact: contacts, contactCount });
  } catch (error) {
    console.error("Error retrieving contacts:", error);
    res.status(500).json({ error: "An error occurred while retrieving contacts" });
  }
};


const updateContact = async (email) => {
  const aggregatePipeline = await Contact.aggregate([
    { $match: { email: email } },
    {
      $group: {
        _id: "$email",
        count: { $sum: 1 },
        docs: { $push: "$_id" },
      },
    },
    {
      $unwind: "$docs",
    },
    {
      $project: {
        _id: 0,
        id: "$docs",
        duplicate: {
          $cond: {
            if: { $eq: ["$count", 1] },
            then: false,
            else: true,
          },
        },
      },
    },
  ]);

  try {
    for (const doc of aggregatePipeline) {
      await Contact.updateOne(
        { _id: doc.id },
        { $set: { duplicate: doc.duplicate } }
      );
    }
  } catch (err) {
   
  }
};

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
      name == "" ||
      industry1 == "" ||
      industry2 == "" ||
      empcount == "" ||
      phoneNumber == "" ||
      website == "" ||
      companyLinkedin == "" ||
      city == "" ||
      country == "" ||
      firstName == "" ||
      lastName == "" ||
      jobRole == "" ||
      email == "" ||
      quality == "" ||
      result == "" ||
      free == "" ||
      role == "" ||
      phoneNumber2 == "" ||
      linkedin == "" ||
      remarks == "" ||
      recordMarksheet == ""
    ) {
   
      res.status(401).send({ message: "Field Empty!" });
      return;
    }
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    let dateNew = today.toISOString();

    
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

    await updateContact(email);

    res.status(200).send({ message: "Contact Created!" });
  } catch (error) {
    console.log("", error);
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

    id,
  } = req.body;
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


    await updateContact(email);

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
        
      })
      .catch((error) => {
        console.error("Error deleting Contact:", error);
      });
 
    await updateContact(contact.email);

    res.status(200).send({ message: "Contact Deleted!" });
  } catch (error) {
    console.log(error);
    res.status(401).send({ message: "Contact Cannot be Deleted!" });
  }
};
const aggregateAndFormat = async (field, filters) => {
  const limit = 10;

  // Create the match stage for filtering
  const matchStage = {};
  if (filters && filters[field] && filters[field] !== null) {
    matchStage[field] = { $regex: filters[field], $options: 'i' }; // 'i' for case-insensitive matching
  }

  // Aggregate pipeline
  const pipeline = [
    { $match: matchStage },
    { $group: { _id: `$${field}` } },
    { $limit: limit },
    { $project: { _id: 0, [field]: "$_id" } }
  ];

  // Execute the aggregation
  const data = await Contact.aggregate(pipeline);

  return data
    .map(entry => entry[field])
    .filter(value => value !== null && value !== '');
};


const getAllFilters = async (req, res) => {
  try {

    console.log("Asdkjasdjkha")

    const data = JSON.parse(req.params.payload);
    console.log(data);
    const fields = [
      
      "role",
      "result",

      "quality",
      "free",
      
    ];

    const name = await aggregateAndFormat('name', data);
    const website = await aggregateAndFormat('website', data);

    const companyName = await aggregateAndFormat('name', data);

    const industry = await aggregateAndFormat('industry1', data);
    const industry2 = await aggregateAndFormat('industry2', data);
    

    
    const Country = await aggregateAndFormat('country', data);
    const Region = await aggregateAndFormat('Region', data);
    const companyLinkedIn = await aggregateAndFormat('companyLinkedIn', data);
    const date = await aggregateAndFormat('date', data);
    
    // Create an array of promises for distinct queries
    const distinctPromises = fields.map(field => Contact.distinct(field).exec());

    // Execute all distinct queries in parallel
    const results = await Promise.all(distinctPromises);

    console.log(companyName);
    // Map the results to respective fields
    const response = {
      name,
      website,
      companyName,
      industry,
      industry2,
      Country,
      Region,
      companyLinkedIn,

      role: results[0],
      result: results[1],
      quality: results[2],
      free: results[3],
      date,
      empcount: ['1-100', '101-200', '201-500', '501-1000']
    };
    
    // Map the results to respective fields
   

    // Add empcount to the response
    response.empcount = ['0-50','51-100','101-200','201-500','501-1000'];

    // Send the response
    
    res.status(200).send({
      message: "Contact filters",
      ...response
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "An error occurred while fetching contact filters.",
      error: error.message
    });
  }
};



const upliftData = async (req, res) => {
  const file = req.file;

  if (!file) {
    
    return res.status(401).send({ message: "Empty File" });
  }

  const { data } = req.body;

  try {
    const workbook = xlsx.readFile(file.destination + file.filename);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const stream = xlsx.stream.to_json(worksheet);

    const readableStream = new Readable({ objectMode: true });
    readableStream._read = () => {};
    stream.on("data", (data) => {
      readableStream.push(data);
    });
    stream.on("end", () => readableStream.push(null));

    const writableStream = Contact.collection.initializeOrderedBulkOp();

   
    let max = 0;

    readableStream.on("data", async (data) => {
      try {
        // Perform any additional data processing if needed

        const newaa = Object.values(data);


        if (max < newaa.length) {
          max = newaa.length;
        }

        if (newaa.length < max) {
          
        }

        const document = new Contact({
          srno: data["Sr #"],
          date: data["Date"],
          name: data["Company Name"],
          industry1: data["Industry 1"],
          industry2: data["Industry 2"],
          empcount: data["Emp Count"],
          phoneNumber: data["Phone Number"],
          website: data["Company Website"],
          companyLinkedin: data["Company LinkedIn"],
          city: data["City"],

          country: data["Country"],
          firstName: data["First Name"],
          lastName: data["Last Name"],
          jobRole: data["Job Role"],
          email: data["Email"],
          quality: data["quality"],
          result: data["result"],
          free: data["free"],
          role: data["role"],
          phoneNumber2: data["Phone Number 2"],

          linkedin: data["Linkedin"],
          remarks: data["Remarks"],
          recordMarksheet: data["Record in Mastersheet"],
        });

        writableStream.insert(document.toObject());
      } catch (error) {
        console.error("Error processing data:", error);
      }
    });

    readableStream.on("end", async () => {
      try {
        await writableStream.execute();

        return res
          .status(200)
          .send({ message: "Contact Uplift Successfully!" });
      } catch (error) {
        console.error("MongoDB stream :", error);
      }
    });
  } catch (err) {
    return res.status(401).send({ message: "Contact Uplift Failed!" });
  }
};

const formatNumber = (number) => {
  if (number < 1000) return number; 
  if (number < 1000000) return (number / 1000).toFixed(1) + 'K'; 
  return (number / 1000000).toFixed(1) + 'M'; 
};

const getNumberOfData = async (req, res) => {
  try {
      const contactCount = await Contact.countDocuments();

      // Format the count
      const formattedCount = formatNumber(contactCount);

      // Log the formatted count
      console.log(formattedCount);

      res.status(200).json({
          contact: formattedCount
      });

  } catch (err) {
      console.error('Error fetching document count:', err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getContactsByCountry = async (req, res) => {
  try {
    
    console.log('Getting contacts');
      const result = await Contact.aggregate([
          { $group: { _id: "$country", count: { $sum: 1 } } },
          { $sort: { count: -1 } }
      ]);

      // Format result
      const formattedResult = result.map(item => ({
          country: item._id,
          count: item.count
      }));

      res.status(200).json(formattedResult);

  } catch (err) {
      console.error('Error fetching contacts by country:', err);
      res.status(500).json({ error: 'Internal Server Error' });
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
  getContactsByCountry,
  getAllFilters,
  getNumberOfData,
  upliftData,
};
