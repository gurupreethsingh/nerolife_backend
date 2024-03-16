
const Artistoutletsynchronization = require("../models/artistoutletsync");

// function to get all the linkages.
async function handlegetLinkage(req, res) {
    const allLinkages = await Artistoutletsynchronization.find({});
    return res.json(allLinkages);

}


  async function handlePostLinkage(req, res) {
    try {
      const body = req.body;
      console.log("body", body);
      
      
    if (!Array.isArray(body) || body.length === 0) {
        return res.status(400).json({ error: "Invalid input format" });
    }

    const insertedIds = [];

    for (let i = 0; i < Math.min(body.length, 3); i++) {
        const currentObject = body[i];

        const result = await Artistoutletsynchronization.create({
            artist_id: currentObject.artist_id,
            outlet_id: currentObject.outlet_id,
            outlet_name: currentObject.outlet_name,
            artist_name: currentObject.artist_name,
        });

        insertedIds.push(result._id);
    }

    console.log("Inserted IDs are ", insertedIds);

            return res.status(201).json({ Message: "Linkage Successful.", insertedIds });
        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
    }
  

  // function to get all the linkages.
  async function handlegetAvailableArtists(req, res) {
    try {
        // Find all records in the Artistoutletsynchronization collection
        const allArtists = await Artistoutletsynchronization.find({});
        
        // Create a Map to count the occurrences of each artist_id
        const artistIdCountMap = new Map();
        
        // Iterate through all the records and count artist_id occurrences
        allArtists.forEach(artist => {
            const artistId = artist.artist_id;
            if (artistIdCountMap.has(artistId)) {
                artistIdCountMap.set(artistId, artistIdCountMap.get(artistId) + 1);
            } else {
                artistIdCountMap.set(artistId, 1);
            }
        });
        
        // Filter artists whose artist_id occurs less than 3 times
        const availableArtists = allArtists.filter(artist => {
            const artistId = artist.artist_id;
            return artistIdCountMap.get(artistId) < 3;
        });
        
        const uniqueArtistInfo = new Set();
        
        // Add unique artist_id and artist_name pairs to the Set
        availableArtists.forEach(artist => {
            const { artist_id, artist_name } = artist;
            uniqueArtistInfo.add(JSON.stringify({ artist_id, artist_name }));
        });
        
        // Convert the Set back to an array of objects
        const artistInfo = Array.from(uniqueArtistInfo).map(entry => JSON.parse(entry));
        
        // Return the filtered list of artist_id and artist_name pairs without duplicates
        return res.json(artistInfo);
        
       
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


async function handlegetLinkedArtists(req, res) {
    try {
        // Find all records in the Artistoutletsynchronization collection
        const allArtists = await Artistoutletsynchronization.find({});
        
        // Create a Map to count the occurrences of each artist_id
        const artistIdCountMap = new Map();
        
        // Iterate through all the records and count artist_id occurrences
        allArtists.forEach(artist => {
            const artistId = artist.artist_id;
            if (artistIdCountMap.has(artistId)) {
                artistIdCountMap.set(artistId, artistIdCountMap.get(artistId) + 1);
            } else {
                artistIdCountMap.set(artistId, 1);
            }
        });
        
        // Filter artists whose artist_id occurs less than 3 times
        const availableArtists = allArtists.filter(artist => {
            const artistId = artist.artist_id;
            return artistIdCountMap.get(artistId) == 3;
        });
        
        const uniqueArtistInfo = new Set();
        
        // Add unique artist_id and artist_name pairs to the Set
        availableArtists.forEach(artist => {
            const { artist_id, artist_name } = artist;
            uniqueArtistInfo.add(JSON.stringify({ artist_id, artist_name }));
        });
        
        // Convert the Set back to an array of objects
        const artistInfo = Array.from(uniqueArtistInfo).map(entry => JSON.parse(entry));
        
        // Return the filtered list of artist_id and artist_name pairs without duplicates
        return res.json(artistInfo);
        
       
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}




async function handlegetAvailableOutlets(req, res) {
    const allOutlets = await Artistoutletsynchronization.find({});
        
        // Create a map to count the occurrences of each artist_id
        const outletIdCountMap = new Map();
        
        // Iterate through all the records and count artist_id occurrences
        allOutlets.forEach(outlet => {
            const outletId = outlet.outlet_id;
            if (outletIdCountMap.has(outletId)) {
                outletIdCountMap.set(outletId, outletIdCountMap.get(outletId) + 1);
            } else {
                outletIdCountMap.set(outletId, 1);
            }
        });
        
        // Filter outlets whose outlet_id occurs less than 3 times
        const availableOutlets = allOutlets.filter(outlet => {
            const outletId = outlet.outlet_id;
            return outletIdCountMap.get(outletId) < 3;
        });

        const uniqueOutletInfo = new Set();
        
        // Add unique artist_id and artist_name pairs to the Set
        availableOutlets.forEach(outlet => {
            const { outlet_id, outlet_name } = outlet;
            uniqueOutletInfo.add(JSON.stringify({ outlet_id, outlet_name }));
        });
        
        // Convert the Set back to an array of objects
        const outletInfo = Array.from(uniqueOutletInfo).map(entry => JSON.parse(entry));
        
        // Return the filtered list of outlet_id and outlet_name pairs without duplicates
        return res.json(outletInfo);
}

async function handlegetResidentArtists(req, res) {

        const { outlet_id } = req.params;


        // Delete one matching document in the collection
        const allArtists = await Artistoutletsynchronization.find({outlet_id: outlet_id});
        
        // Create a map to count the occurrences of each artist_id
        return res.json(allArtists);
}

async function handlegetResidentOutlets(req, res) {

    const { artist_id } = req.params;


    // Delete one matching document in the collection
    const residentOutlets = await Artistoutletsynchronization.find({artist_id: artist_id});
    
    // Create a map to count the occurrences of each artist_id
    return res.json(residentOutlets);
}

async function handlegetLinkedOutlets(req, res) {
    const allOutlets = await Artistoutletsynchronization.find({});
        
        // Create a map to count the occurrences of each artist_id
        const outletIdCountMap = new Map();
        
        // Iterate through all the records and count artist_id occurrences
        allOutlets.forEach(outlet => {
            const outletId = outlet.outlet_id;
            if (outletIdCountMap.has(outletId)) {
                outletIdCountMap.set(outletId, outletIdCountMap.get(outletId) + 1);
            } else {
                outletIdCountMap.set(outletId, 1);
            }
        });
        
        // Filter outlets whose outlet_id occurs less than 3 times
        const availableOutlets = allOutlets.filter(outlet => {
            const outletId = outlet.outlet_id;
            return outletIdCountMap.get(outletId) == 3;
        });

        const uniqueOutletInfo = new Set();
        
        // Add unique artist_id and artist_name pairs to the Set
        availableOutlets.forEach(outlet => {
            const { outlet_id, outlet_name } = outlet;
            uniqueOutletInfo.add(JSON.stringify({ outlet_id, outlet_name }));
        });
        
        // Convert the Set back to an array of objects
        const outletInfo = Array.from(uniqueOutletInfo).map(entry => JSON.parse(entry));
        
        // Return the filtered list of outlet_id and outlet_name pairs without duplicates
        return res.json(outletInfo);
}

async function handleDeleteLinkage(req, res) {
    try {
    const { artist_id, outlet_id } = req.params;

      const query = { artist_id, outlet_id };

      // Delete one matching document in the collection
      const deletedLinkage = await Artistoutletsynchronization.findOneAndDelete(query);
  
      if (!deletedLinkage) {
        return res.status(404).json({ error: "Artist and Outlet are not Linked" });
      }
  
      const deletionTime = new Date();
      // You can perform additional operations or logging related to the deletion here.
      console.log(deletionTime);
  
      return res.json({
        status: "Linkage deleted successfully.",
        deletedLinkage,
        deletionTime,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
  }

module.exports = {
  handlegetLinkage,
  handlePostLinkage,
  handlegetAvailableArtists,
  handlegetAvailableOutlets,
  handleDeleteLinkage,
  handlegetLinkedArtists,
  handlegetLinkedOutlets,
  handlegetResidentArtists,
  handlegetResidentOutlets

};