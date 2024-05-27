const Company = require("../models/Company");
const { Readable } = require("stream");
const xlsx = require("xlsx");
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
      console.log(page.searchQuery,page)

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

    console.log(query);

    
    


    const company = await Company.find(query).skip(skip).limit(limit);

    const companyCount = await Company.countDocuments(query);
  
 
    res.status(200).send({ company, companyCount });
  } catch (error) {
 
    res

      .status(500)
      .json({ error: "An error occurred while retrieving products" });
  }
};



const upliftData = async (req, res) => {
  // const { data } = req.body;

  
  // try {
   

  //   if (data) {
  //     data.map(async (element) => {
        




    
  //       try {
  //         const contact = await Company.create({
  //          companyName: element[0],
  //           name :element[1],
  //          website: element[2],
  //          industry: element[3],
  //          industry2: element[4],
  //          companyLinkedIn: element[5],
  //           Country: element[6],
  //           Region:element[7],
  //           duplicate:false,

            
  //          });
       
  //          await updateCompany();
  //       } catch (error) {

  //         console.log(error);
  //       }
  //     });

 

  //     res.status(200).send({ message: "Company Uplift Successfully!" });
  //   } else {
  //     res.status(401).send({ message: "Company Uplift Failed!" });
  //   }
  // } catch (err) {
  //   res.status(401).send({ message: "Company Uplift Failed!" });
  // }

  const file = req.file;

  if (!file) {

    return res.status(401).send({ message: "Empty File" });
  }

  
  try {

    const workbook = xlsx.readFile(file.destination + file.filename);
    
    const sheetName = workbook.SheetNames[0];
  
    const worksheet  = workbook.Sheets[sheetName];
    const stream = xlsx.stream.to_json(worksheet);


  
    const readableStream = new Readable({ objectMode: true });
    readableStream._read = () => {};

    stream.on("data", (data) => {

      readableStream.push(data);
    });
    stream.on("end", () => readableStream.push(null));

    const writableStream = Company.collection.initializeOrderedBulkOp();


    let max = 0;

    readableStream.on("data", async (data) => {
     

      try {
        // Perform any additional data processing if needed

        const newaa = Object.values(data);

        // const obj = newaa.reduce((acc, value, index) => {
        //   acc[index] = value;
        //   return acc;
        // }, {});

        if (max < newaa.length) {
          max = newaa.length;
        }

        if (newaa.length < max) {
          // console.log(data);
        }


        const document = new Company({


          companyName: data["Company Name"],
          
          industry: data["Industry 1"],
          industry2: data["Industry 2"],
          website: data["Company Website"],
          companyLinkedin: data["Company LinkedIn"],
          Country: data["Country"],
          city: data["City"],
          Region:"",
          duplicate:false,
          
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
    console.log(err)
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

const getFilterData =async (req, res) => {



  const website = await Company.distinct("website");
  
  const companyName = await Company.distinct("companyName");
  
  const industry = await Company.distinct("industry");
  const industry2 = await Company.distinct("industry2");
  const Country = await Company.distinct("Country");
  const Region = await Company.distinct("Region");
  const companyLinkedIn = await Company.distinct("companyLinkedIn");
  const name = await Company.distinct("name");



  res.status(200).send({ message: "Company filters ",name,website,companyName,industry,industry2,Country,Region,companyLinkedIn });

  
  
  

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
};


