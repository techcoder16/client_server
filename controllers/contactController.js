const Contact = require("../models/Contact");

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

  
 
  for (const doc of aggregatePipeline) {
    await Contact.updateOne({ _id: doc.id }, { $set: { duplicate: doc.duplicate } });
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
      email == ""
    ) {
      res.status(401).send({ message: "Field Empty!" });
      return;
    }

    const contact = Contact.create({
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
    });
   await updateContact();
    res.status(200).send({ message: "Contact Created!" });
  } catch (error) {
    console.log(error);
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
    });

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
  const { data } = req.body;

  
  try {
   

    if (data) {
      data.map(async (element) => {
        



        try {
          const contact = await Contact.create({
            name :element[0],
            wesbite: element[1],
            industry1: element[2],
           industry2:  element[3],
            empcount: element[4],
            phoneNumber : element[5],
            linkedin: element[6],
           city: element[7],
           region: element[8],
           country: element[9],
           firstName: element[10],
           lastName: element[11],
           jobRole: element[12],
        
            duplicate:false,

          }
            
            
          );
          await updateContact();

        } catch (error) {}
      });

 

      res.status(200).send({ message: "Contact Uplift Successfully!" });
    } else {
      res.status(401).send({ message: "Contact Uplift Failed!" });
    }
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
