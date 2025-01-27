const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { Redis } = require('@upstash/redis');
const redis = require('../Upstash');

dotenv.config();

const app = express();
const router = express.Router();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Test MongoDB connection
client.connect()
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch(err => console.error("Failed to connect to MongoDB", err));

// Upstash Redis configuration







// Function to delete all documents in a collection
async function deleteAllDocumentsFromCollection(uri, dbName, collectionName) {
 
  try {
    // Connect to the MongoDB server
    await client.connect();

    // Access the database and collection
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    // Delete all documents
    const result = await collection.deleteMany({});
    console.log(`Deleted ${result.deletedCount} documents from the collection "${collectionName}".`);
  } catch (error) {
    console.error('Error deleting documents:', error);
  } finally {
    // Close the database connection
    await client.close();
  }
}
// deleteAllDocumentsFromCollection(uri,"Email","upstashData");

// Function to pull data from Redis and insert it into MongoDB
// const pullDataFromRedisAndInsert = async () => {
//   try {
//     const redisData = await redis.hgetall('emailOpen');
//     if (!redisData || Object.keys(redisData).length === 0) {
//       console.log('No data found in the hash emailOpen.');
//       return;
//     }

//     const entries = Object.entries(redisData);

//     const db = client.db('Email');
//     for (const [email, dataStr] of entries) {
//       try {
//         // Parse the JSON string safely
//         const parsedData = JSON.parse(dataStr);

//         if (typeof parsedData === 'object' && parsedData !== null) {
//           const userInfo = {
//             ...parsedData,
//             email,
//             timestamp: parsedData.timestamp || new Date().toISOString(),
//             cid: parsedData.cid || generateUniqueId(),
//           };

//           // Upsert directly into MongoDB
//           await db.collection('upstashData').updateOne(
//             { key: userInfo.cid },
//             { $set: { key: userInfo.cid, value: userInfo } },
//             { upsert: true }
//           );

//           console.log(`Processed data for ${email}`);
//         }
//       } catch (error) {
//         console.error(`Failed to parse data for ${email}:`, error.message);
//       }
//     }

//     console.log('Data synchronization completed.');
//   } catch (error) {
//     console.error('Error pulling data from Redis or inserting into MongoDB:', error.message);
//   }
// };

// Unique ID generation function
// function generateUniqueId() {
//   return new ObjectId().toString();
// }

// Run the function every 5 seconds
//setInterval(pullDataFromRedisAndInsert, 5000);

//setTimeout(() => {
 // pullDataFromRedisAndInsert()
//}, 1000);





// SMTP credentials route
router.post("/save-setting", async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const data = await client
      .db("Email")
      .collection("smpt")
      .updateOne(
        { username }, // Filter by username
        { $set: { email, password } }, // Update email and password
        { upsert: true } // Insert document if not found
      );

    res.send({
      message: "Operation successful",
      matchedCount: data.matchedCount,
      modifiedCount: data.modifiedCount,
      upsertedId: data.upsertedId,
    });
  } catch (err) {
    res.status(500).send({
      message: "An error occurred",
      error: err.message,
    });
  }
});

router.post('/getsetting', async (req, res) => {
  const { username } = req.body; // No need for () after req.body
  try {
    // `find` returns a cursor, so you need to use `toArray()` or another method to get the documents
    const result = await client.db('Email').collection('smpt').find({ username }).toArray();

    
    res.status(200).send(result[0]); // Send the fetched data
  } catch (e) {
    console.error('Error fetching settings:', e); // Log the error for debugging
    res.status(500).send({ error: 'An error occurred while fetching the settings.' }); // Return an appropriate error message
  }
});


router.post('/getTrack', async (req, res) => {
  try {
    // Fetch all data from the 'emailOpen' hash in Redis
    const emailOpenData = await redis.hgetall('emailOpen');

   

    // Send the retrieved data as the response
    res.status(200).json(emailOpenData);
  } catch (error) {
    console.error('Error fetching email open data:', error);

    // Send an error response
    res.status(500).json({ error: 'Failed to fetch email open data' });
  }
});



   
  

// Bulk email sending route
router.post('/send-emails', async (req, res) => {
  const { subject, recipients, from, HTML, email, password } = req.body;

  try {
    const db = client.db("Email");
    const emailData = {
      'username': from,
      recipients: Array.isArray(recipients) ? recipients : [recipients],
      subject,
      'htmlContent': HTML,
      sentAt: new Date(),
    };

    // Insert email data
    const result = await db.collection('Sentemails').insertOne(emailData);
    const cid=result.insertedId.toString();
    
    // Send emails
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: password,
      },
    });

    const emailPromises = recipients.map(async (recipient) => {
      const trackingPixel = `<img src="https://khushiclose.khushibanchhor21.workers.dev/track?email=${encodeURIComponent(recipient)}&campaign=${encodeURIComponent(cid)}" alt="" width="1" height="1" style="display:none;" />`;

      const htmlWithTracking = `${HTML}${trackingPixel}`;

      const mailOptions = {
        from,
        to: recipient,
        subject,
        html: htmlWithTracking,
      };

      return transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);

    res.status(200).json({ 
      message: 'Email saved and sent successfully!', 
      _id: result.insertedId 
    });

  } catch (error) {
    console.error('Error processing emails:', error);
    res.status(500).json({ 
      message: 'Failed to process emails.', 
      error: error.message 
    });
  }
});
// User login route
router.post('/login', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  try {
    const user = await client.db('Email').collection('user').findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ message: 'Login successful!', user });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Failed to log in user.', details: error.message });
  }
});

// User signup route
router.post('/signup', async (req, res) => {
  const { email, password, username } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const existingUser = await client.db('Email').collection('user').findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      email,
      password: hashedPassword,
    };

    await client.db('Email').collection('user').insertOne(newUser);

    res.status(201).json({ message: 'User signed up successfully!' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Failed to sign up user.', details: error.message });
  }
});

// Route to get all templates from 'template' collection
router.get('/templates', async (req, res) => {
  try {
    const db = client.db("Email");  // Select the 'Email' database
    const templates = await db.collection('Templates').find().toArray();  // Query the 'template' collection
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching templates', error: err });
  }
});

// Route to create a new template and save it in 'template' collection
router.post('/templates', async (req, res) => {
  const { name, subject, content } = req.body;
  
  try {
    const db = client.db("Email");  // Select the 'Email' database
    const newTemplate = { name, subject, content };

    // Insert the new template into the 'template' collection
    const result = await db.collection('Templates').insertOne(newTemplate);

    res.status(201).json({ _id: result.insertedId, ...newTemplate });
  } catch (err) {
    res.status(500).json({ message: 'Error saving template', error: err });
  }
});

// Route to delete a template by ID from the 'template' collection
router.delete('/templates/:id', async (req, res) => {
  const templateId = req.params.id;
  console.log(templateId);
  
  if (!ObjectId.isValid(templateId)) {
    return res.status(400).json({ message: 'Invalid template ID' });
  }
  try {
    const db = client.db("Email");  // Select the 'Email' database

    // Delete the template from the 'TemplateS' collection
    const result = await db.collection('Templates').deleteOne({ _id: new ObjectId(templateId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json({ message: 'Template deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting template', error: err });
  }
});


router.get('/templates/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ObjectId format
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid template ID format' });
    }

    // Access the MongoDB collection and find the document by ID
    const result = await db.collection('Templates').findOne({ _id: new ObjectId(id) });

    if (!result) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to save sent emails
router.post('/save-sent-email', async (req, res) => {
  const { username, recipients, subject, htmlContent } = req.body;

  // Validate required fields
  if (!username || !recipients || !subject || !htmlContent) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const db = client.db("Email"); // Select the 'Email' database
    const emailData = {
      username,
      recipients: Array.isArray(recipients) ? recipients : [recipients], // Ensure recipients is an array
      subject,
      htmlContent,
      sentAt: new Date(), // Timestamp of when the email was saved
    };

    // Insert the email data into the 'SentEmails' collection
    const result = await db.collection('Sentemails').insertOne(emailData);

    res.status(201).json({ message: 'Email saved successfully!', _id: result.insertedId });
  } catch (error) {
    console.error('Error saving email:', error);
    res.status(500).json({ message: 'Failed to save email.', error: error.message });
  }
});

// Route to get HTML content for a specific user
router.get('/get-html-content/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const db = client.db("Email"); // Select the 'Email' database

    // Find emails associated with the provided username
    const emails = await db.collection('Sentemails').find({ username }).toArray();

    if (emails.length === 0) {
      return res.status(404).json({ message: 'No emails found for this username' });
    }

    // Extract HTML content from each email
    const htmlContents = emails.map(email => ({
      subject: email.subject,
      htmlContent: email.htmlContent,
      sentAt: email.sentAt, // Optional: Include the sent timestamp for reference
    }));

    res.json({ username, htmlContents });
  } catch (error) {
    console.error('Error fetching HTML content:', error);
    res.status(500).json({ message: 'Failed to fetch HTML content.', error: error.message });
  }
});

router.delete('/delete-html-content/:username/:id', async (req, res) => {
  const { username, id } = req.params;

  try {
    if (!id || !username) {
      return res.status(400).json({ message: 'Missing username or id' });
    }

    // Convert the id to ObjectId if it's valid
    const objectId = ObjectId.isValid(id) ? new ObjectId(id) : null;

    if (!objectId) {
      return res.status(400).json({ message: 'Invalid campaign ID format.' });
    }

    const db = client.db("Email"); // Select the 'Email' database

    // Delete the campaign associated with the username and specific id
    const result = await db.collection('Sentemails').deleteOne({ _id: objectId, username });

    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'Campaign deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Campaign not found.' });
    }
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ message: 'Error deleting campaign.' });
  }
});


module.exports = router;
