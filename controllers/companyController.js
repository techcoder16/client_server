const Company = require("../models/Company");
const { Readable } = require("stream");
const xlsx = require("xlsx");
const fs = require('fs');
const csv = require('csv-parser');
const { pipeline, Transform } = require('stream');
const { promisify } = require('util');
const pipelineAsync = promisify(pipeline);
const FilterCompany = require('../models/FilterCompanies');

// const getcompany = async (req, res) => {
//   try {
//     const company = await Company.find({});

//     if (!company) {
//       return res.status(401).json({ message: "No company Found" });
//     } else {
//       res.json({ message: "Successfully Get All companys", company });
//     }
//   } catch (err) {
//     console.log(err);
//     return res.status(401).json({ message: "company Error" });
//   }
// };


const getcompany = async (req, res) => {
  try {

    

      const page = JSON.parse(req.params.payload);

      console.log(page);



    const limit = parseInt(req.query.limit) || 10;

    const skip = (page.page - 1) * limit;
      

    const explainResult = await Company.find({}).explain();

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
      query.companyName = { $regex: page.searchQuery, $options: "i" };
    }


    
    


    const company = await Company.find(query).skip(skip).limit(limit);

    const companyCount = await Company.countDocuments(query);
  
 
    res.status(200).send({ company, companyCount });
  } catch (error) {
 
    res

      .status(500)
      .json({ error: "An error occurred while retrieving products" });
  }
};

// const upliftData = async (req, res) => {
//   const file = req.file;

//   if (!file) {
//     return res.status(400).send({ message: "No file uploaded" });
//   }

//   try {
//     const workbook = xlsx.readFile(file.path);
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];

//     const stream = xlsx.stream.to_json(worksheet);
//     const batchSize = 1000; // Adjust batch size based on your database and performance testing

//     let batch = [];
//     let count = 0;

//     // Function to process each row and return a promise
//     const processRow = async (row) => {
//       try {
//         console.log(row);

//         // Create Company document
//         const companyDocument = new Company({
//           companyName: row["Company Name"],
//           industry: row["Industry 1"],
//           industry2: row["Industry 2"],
//           website: row["Company Website"],
//           companyLinkedIn: row["Company LinkedIn"],
//           Country: row["Country"],
//           city: row["City"],
//           Region: "",
//           duplicate: false,
//         });

//         // Create FilterCompany document (for unique filtering)
//         const filterDocument = new FilterCompany({
//           companyName: row["Company Name"],
//           industry: row["Industry 1"],
//           industry2: row["Industry 2"],
//           website: row["Company Website"],
//           companyLinkedIn: row["Company LinkedIn"],
//           Country: row["Country"],
//           city: row["City"],
//           Region: "",
//         });


//         // Check if document with companyName exists in FilterCompany collection
//         const existingFilterCompany = await FilterCompany.findOne({ companyName: row["Company Name"] });

//         if (existingFilterCompany) {
//           console.log(`FilterCompany document for ${row["Company Name"]} already exists, skipping.`);
//         } else {
//           // Insert new FilterCompany document
//           await FilterCompany.create(filterDocument);
//           console.log(`FilterCompany document for ${row["Company Name"]} created.`);
//         }

//         return companyDocument;
//       } catch (error) {
//         console.error("Error processing data:", error);
//         throw error;
//       }
//     };

//     // Create a Transform stream to process batches of rows concurrently
//     const transformStream = new Transform({
//       objectMode: true,
//       transform: async (row, encoding, callback) => {
//         try {
//           const processedRow = await processRow(row);
//           batch.push(processedRow);
//           count++;

//           // Insert batch into Company collection when batch size is reached
//           if (batch.length === batchSize) {
//             console.log("Batch size reached for Company collection", batch);
//             await Company.insertMany(batch);
//             batch = [];
//           }

//           callback();
//         } catch (error) {
//           console.error("Error processing row:", error);
//           callback(error);
//         }
//       }
//     });

//     // Handle end of stream
//     transformStream.on('finish', async () => {
//       // Insert any remaining documents in Company collection
//       if (batch.length > 0) {
//         console.log("Inserting remaining batch for Company collection", batch);
//         await Company.insertMany(batch);
//       }

//       console.log("All items have been processed");
//       return res.status(200).send({ message: "Contact Uplift Successfully!" });
//     });

//     // Pipeline to process data through the transform stream
//     stream.pipe(transformStream);

//   } catch (err) {
//     console.error("Error processing file:", err);
//     return res.status(401).send({ message: "Contact Uplift Failed!" });
//   }
// };


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
        const document = new Company({
          companyName: row["Company Name"],
          industry: row["Industry 1"],
          industry2: row["Industry 2"],
          website: row["Company Website"],
          companyLinkedIn: row["Company LinkedIn"],
          Country: row["Country"],
          city: row["City"],
          Region: "",
          duplicate: false,
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




const updateCompany = async (email)=>{

  const aggregatePipeline = await Company.aggregate([
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
 
  for (const doc of aggregatePipeline) {
    await Company.updateOne({ _id: doc.id }, { $set: { duplicate: doc.duplicate } });
  }
  
  
}

const createcompany = async (req, res) => {
  const {
    companyName, 
     website , 
      industry , 
      industry2 , 
      companyLinkedIn,
      Region,
      Country,
      name,
      date,
  
      
  
  } = req.body;

  try {


  


    if (
        companyName == ""  || 
 
   website  == ""  || 
    industry  == ""  || 
    industry2  == ""  || 
    companyLinkedIn == ""  ||
    Region == ""  ||
    Country == ""  ||
    name == ""  
  
    

    ) {

     

      res.status(401).send({ message: "Field Empty!" });
      return;
    }

    let duplicate = false;
    const duplicateCompany = await Company.findOne({companyName:companyName});
    if(duplicateCompany)
    {duplicate = true;  await Company.updateMany({companyName:companyName},{duplicate:true});   
   }

    
  

    const company = Company.create({
        companyName, 
      
         website , 
          industry , 
          industry2 , 
          companyLinkedIn,
          Region,
          duplicate ,
          Country,
          name,
          date,
          
      
    });
    res.status(200).send({ message: "Company Created!" });
  } catch (error) {
    console.log(error);
  }
};
const updatecompanybyID = async (req, res) => {
  const {  
    
    
    companyName, 

     website , 
      industry , 
      industry2 , 
      companyLinkedIn,
      Region,
      Country,
      name,
    id,
      

      
   } = req.body;
  try {
    const filter = { _id: id };
      const oldname = await Company.findOne({_id:id},{companyName:1});

  
    const company = await Company.findOneAndUpdate(filter, {
        companyName, 
     
         website , 
          industry , 
          industry2 , 
          companyLinkedIn,
          Region,
          Country,
          name,
      
          
      
    });


 
  
    
   await updateCompany(email); 
    




    res.status(200).send({ message: "company Updated!", company: company });
  } catch (error) {
    console.log(error);
  }
};
const getIdbyName = async (req, res) => {
  const { company_name } = req.params;

  try {
    const company = await Company.findOne({ company_name: company_name });

    if (company) {
      res.status(200).send({ id: company.id, _id: company._id });
    } else {
      res.status(201).send({ id: "", _id: "" });
    }
  } catch (error) {
    res.status(201).send({ id: "", _id: "" });
  }
};

const getcompanybyBasicId = async (req, res) => {
  const { ID } = req.params;
  try {
    const company = await Company.findOne({ _id: ID });

    if (company) {
      res
        .status(200)
        .send({ company_name: company.company_name, _id: company._id });
    } else {
      res.status(201).send({ company_name: "", _id: "" });
    }
  } catch (error) {
    res.status(201).send({ company_name: "", _id: "" });
  }
};

const getcompanybyId = async (req, res) => {
  const { ID } = req.params;
  try {
    const company = await Company.findOne({ id: ID });

    if (company) {
      res
        .status(200)
        .send({ company_name: company.company_name, _id: company._id });
    } else {
      res.status(201).send({ company_name: "", _id: "" });
    }
  } catch (error) {
    res.status(201).send({ company_name: "", _id: "" });
  }
};

const getAllcompanys = async (req, res) => {
  const { ID } = req.params;
  try {
    const company = await Company.find(
      {
        $and: [{ id: { $ne: ID } }],
      },
      { company_name: 1, _id: 1 }
    );

    if (company) {
      res.status(200).send({ company });
    } else {
      res.status(201).send({ message: "No company Added" });
    }
  } catch (error) {
    res.status(201).send({ message: "No company Added" });
  }
};

const deletecompanyById = async (req, res) => {
  const { ID } = req.body;
  try {
    let company = Company.findOneAndRemove({ _id: ID })
      .then((element) => {
        console.log("Company deleted:", element);
      })
      .catch((error) => {
        console.error("Error deleting company:", error);
      });

      await updateCompany(company.email);

    res.status(200).send({ message: "Company Deleted!" });


  } catch (error) {
    console.log(error);
    res.status(401).send({ message: "company Cannot be Deleted!" });
  }
};


const sanitizeAndDistinct = async (field) => {
  const distinctValues = await Company.distinct(field);

  const sanitizedDistinctValues = distinctValues.map(value => {
    const sanitizedValue = value.replace(/[^\w\s]/gi, '');
    return sanitizedValue.toLowerCase();
  });

  const uniqueValues = [...new Set(sanitizedDistinctValues)];

  return uniqueValues;
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
  const data = await Company.aggregate(pipeline);

  return data
    .map(entry => entry[field])
    .filter(value => value !== null && value !== '');
};


const getFilterData = async (req, res) => { 
  
  const data = JSON.parse(req.params.payload);


  try {
    const website = await aggregateAndFormat('website',data);
    const companyName = await aggregateAndFormat('companyName',data);
    const industry = await aggregateAndFormat('industry',data);
    const industry2 = await aggregateAndFormat('industry2',data);
    const Country = await aggregateAndFormat('Country',data);
    const Region = await aggregateAndFormat('Region',data);
    const companyLinkedIn = await aggregateAndFormat('companyLinkedIn',data);
    const name = await aggregateAndFormat('name',data);

    res.status(200).json({
      message: "Company filters",
      name,
      website,
      companyName,
      industry,
      industry2,
      Country,
      Region,
      companyLinkedIn
    });
  } catch (err) {
    console.error("Error fetching filter data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const formatNumber = (number) => {
  if (number < 1000) return number; 
  if (number < 1000000) return (number / 1000).toFixed(1) + 'K'; 
  return (number / 1000000).toFixed(1) + 'M'; 
};

const getNumberOfData = async (req, res) => { 
  let value = 0;
  try {
      const company = await Company.countDocuments();


    
      res.status(200).json({
       company
      });

  }catch (err) {
  }
} 


const getCompanyCountByIndustry1 = async (req, res) => {
  try {
    
    console.log('Getting contacts');
      const result = await Company.aggregate([
          { $group: { _id: "$industry1", count: { $sum: 1 } } },
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




// const getCompanyCountByIndustry1 = async (req, res) => {
//   try {
//     const results = await Company.aggregate([
//       {
//         $group: {
//           _id: "$industry",   // Group by the 'industry' field
//           count: { $sum: 1 }  // Count the number of documents in each group
//         }
//       },
//       {
//         $sort: { count: -1 }  // Optional: Sort by count in descending order
//       }
//     ]);

//     res.status(200).json(results);
//     return results;
//   } catch (err) {
//     console.error('Error aggregating company counts by industry:', err);
//     throw err;
//   }
// };

const getCompanyCountByIndustry2 = async (req, res) => {
  try {
    const results = await Company.aggregate([
      { $group: { _id: "$industry2", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json(results);
  } catch (err) {
    console.error('Error getting count by industry2:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
  getcompany,
  createcompany,
  updatecompanybyID,
  deletecompanyById,
  getcompanybyId,
  getAllcompanys,
  getIdbyName,
  upliftData,
  getcompanybyBasicId,
  getFilterData,
  getNumberOfData,
  getCompanyCountByIndustry1,
  getCompanyCountByIndustry2,

};


