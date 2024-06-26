const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./models/userSchema')
const Product = require('./models/productSchema')
const Message = require('./models/messageSchema')
const Conversation = require('./models/conversationSchema')
const Offer = require('./models/offerSchema')

// secret key for jwt
const SECRET_KEY = "secretkey"
const REFRESH_SECRET_KEY = "refreshsecretkey"

// connect to express app
const app = express()

// connect to mongodb
const mongo_url = 'mongodb+srv://root:root@cluster30.tmgevxw.mongodb.net/UsersDB?retryWrites=true&w=majority'

mongoose.connect(mongo_url)
.then(() => {
    console.log('Connected to MongoDB')
    app.listen(8000, () => {
        console.log('Server is running on port 8000')
    })
}).catch((err) => {
    console.log(err)
})


// middleware
app.use(bodyParser.json())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// middleware to authenticate token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401).json("No token")
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

// routes => CRUD API

// POST Request to create a new user
app.post('/register', async (req, res) => {
    try {
        const {email, username, password} = req.body
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({email, username, password: hashedPassword})
        await newUser.save()
        res.status(201).json({message: 'New account created successfully'})
    } catch (error) {
        res.status(500).json({error: "Error Signing Up"})
    }
})

// GET Request to get all users
app.get('/register', async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({error: "Error getting users"})
    }
})

// POST Request to login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(404).json({error: "User not found"})
        }
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            return res.status(400).json({error: "Invalid Password"})
        }
        const token = jwt.sign({ userId: user._id}, SECRET_KEY, {expiresIn: '1h'})
        const refreshToken = jwt.sign({ userId: user._id}, REFRESH_SECRET_KEY)
        res.json({ message: 'Successful login', token: token, refreshToken: refreshToken})
    } catch (error) {
        res.status(500).json({error: "Error logging in", error})
    }
})

// GET Request to get logged in user's account info
app.get('/accountinfo', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
        // console.log(user)
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({error: "Error getting user"})
    }
})

// Get an account of a specific user specified by id
app.get('/account/:id', async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.findById(id)
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(`Error getting Account ${id}`)
    }
})

// PATCH Request to edit user's username
app.patch('/editusername', authenticateToken, async (req, res) => {
    try {
        const { username } = req.body
        const user = await User.findById(req.user.userId)
        user.username = username
        await user.save()
        res.status(200).json({message: 'Username updated successfully', username: username})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

// PATCH Request to edit user's email
app.patch('/editemail', authenticateToken, async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findById(req.user.userId)
        user.email = email
        await user.save()
        res.status(200).json({message: 'Email updated successfully', email: email})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

// PATCH Request to edit user's password
app.patch('/editpassword', authenticateToken, async (req, res) => {
    try {
        const { password } = req.body
        const user = await User.findById(req.user.userId)
        user.password = await bcrypt.hash(password, 10)
        await user.save()
        res.status(200).json({message: 'Password updated successfully'})
    } catch (error) {
        res.status(500).json({error: "Error updating password"})
    }
})

// DELETE Request to delete user's account
app.delete('/deleteaccount', authenticateToken, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.userId)
        res.status(200).json({message: 'Account deleted successfully'})
    } catch (error) {
        res.status(500).json({error: "Error deleting account"})
    }
})

// POST Request to create a new product
app.post('/newproduct', async (req, res) => {
    try {
        const { name, description, image_url, price_range } = req.body

        const token = req.headers['authorization'].split(' ')[1]
        const debug = jwt.verify(token, SECRET_KEY).userId
        
        const newProduct = new Product({ name, description, owner: debug, image_url, price_range })
        await newProduct.save()
        res.status(201).json({message: 'Product created successfully'})
    } catch (error) {
        res.status(500).json({error: "Error creating product"})
    }
})

// GET Request to get all products
app.get('/allproducts', async (req, res) => {
    try {
        const products = await Product.find()
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({error: "Error getting products"})
    }
})

// GET Request to get a specific product
app.get('/product/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        const owner = await User.findById(product.owner);
        product.owner = owner;
        res.status(200).json(product)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({error: "Error getting product"})
    }
})

// GET Request to get all products of a specific user
app.get('/owner/:id', async (req, res) => {
    try {
        const owner = await User.findById(req.params.id)
        res.status(200).json(owner)
    } catch (error) {
        res.status(500).json({error: "Error getting owner"})
    }
})

// Send Message Endpoint
app.post('/sendmessage/:id', authenticateToken, async (req, res) => {
    try {
        const { message, offer } = req.body
        const { id:receiverId } = req.params
        const senderId = req.user.userId

        let conversation = await Conversation.findOne ({
            participants: { $all: [senderId, receiverId] }
        })

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
            offer
        })

        if (newMessage) {
            conversation.messages.push(newMessage._id)
        }

        await Promise.all([newMessage.save(), conversation.save()])

        res.status(201).json(newMessage)

    } catch (error) {
        console.log("error in sendMessage")
        res.status(500).json({error: "Error sending message"})
    }
})

// GET request to get all messages for a conversation with id
app.get('/getmessages/:id', authenticateToken, async (req, res) => {
    try {
        const { id:userToChatId } = req.params
        const user = req.user.userId
        const conversation = await Conversation.findOne({
            participants: { $all: [user, userToChatId] }
        }).populate('messages')

        if (!conversation) {
            return res.status(200).json([])
        }

        const messages = conversation.messages

        res.status(200).json(messages)
        
    } catch (error) {
        console.log("error in getMessages")
        res.status(500).json({error: "Error getting messages"})
    }
})

// GET request to get all conversations for a user
app.get('/users/sidebar', authenticateToken, async (req, res) => {
    try {
        const loggedInUser = req.user.userId;
        const allConversations = await Conversation.find({ participants: loggedInUser }).select('participants -_id');
        const allConversationIds = allConversations.map(conversation => conversation.participants).flat();
        const allUsers = await User.find({ _id: { $in: allConversationIds, $ne: loggedInUser } }).select('-password');
        res.status(200).json(allUsers);
    } catch (error) {
        console.log("error in getSidebar")
        res.status(500).json({error: "Error getting users"})
    }
})

// PUT request to add a rating to a user
app.put('/rate/:id/', authenticateToken, async (req, res) => {
    try {
        const { rating } = req.body
        const { id:userId } = req.params
        const user = await User.findById(userId)
        user.ratings.push({rating})
        user.totalRating = (user.totalRating * ((user.ratings.length - 1) / user.ratings.length)) + (rating / user.ratings.length)
        await user.save()
        res.status(200).json({message: 'Rating updated successfully'})
    } catch (error) {
        res.status(500).json({error: "Error updating rating"})
    }
})

// GET request to get all products for logged in user
app.get('/user/products', authenticateToken, async (req, res) => {
    try {
        const products = await Product.find({ owner: req.user.userId })
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({error: "Error getting products"})
    }
})

// GET request to get all products for a user with id
app.get('/user/:id/products', async (req, res) => {
    try {
        const { id:userId } = req.params
        const products = await Product.find({ owner: userId })
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({error: "Error getting products"})
    }
})

// DELETE request to delete a product with id
app.delete('/delete/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params
        await Product.findByIdAndDelete(id)
        res.status(200).json({message: 'Product deleted successfully'})
    } catch (error) {
        res.status(500).json({error: "Error deleting product"})

    }
})

// POST request to create an offer to a user with id from logged in user
app.post('/createoffer/:id', authenticateToken, async (req, res) => {
    try {
        const { products, messageId } = req.body
        const { id:receiverId } = req.params
        const senderId = req.user.userId

        const newOffer = new Offer({
            senderId,
            receiverId,
            products, 
            messageId
        })

        await newOffer.save()
        res.status(201).json({message: 'Offer created successfully'})
    } catch (error) {
        res.status(500).json({error: "Error creating offer"})
    }
})

// GET request to get all offers for logged in user
app.get('/getoffers', authenticateToken, async (req, res) => {
    try {
        const offers = await Offer.find({ $or: [{ receiverId: req.user.userId }, { senderId: req.user.userId }] })
        res.status(200).json(offers)
    } catch (error) {
        res.status(500).json({error: "Error getting offers"})
    }
})

// DELETE request to delete an offer with messageID: id after accepting
app.delete('/acceptoffer/:id', authenticateToken, async (req, res) => {
    try {
        const { id:messageId } = req.params
        const offer = await Offer.findOne({ messageId })
        console.log(offer)
        if (offer) {

            await Product.deleteMany({ _id: { $in: offer.products } })

            await Offer.deleteOne(offer._id)

            res.status(200).json({ message: 'Offer accepted' });
        } else {
            res.status(404).json({ error: 'Offer not found' });
        }

    } catch (error) {
        console.log("error in acceptOffer: ", error.message)
        res.status(500).json({error: "Error accepting offer"})
    }
})

// DELETE request to delete an offer with messageID: id after declining, but doesn't delete the products
app.delete('/declineoffer/:id', authenticateToken, async (req, res) => {
    try {
        const { id:messageId } = req.params
        const offer = await Offer.findOne({ messageId })

        if (offer) {
            await offer.remove();
            res.status(200).json({ message: 'Offer declined' });
        } else {
            res.status(404).json({ error: 'Offer not found' });
        }
    } catch (error) {
        console.log("error in declineOffer")
        res.status(500).json({error: "Error declining offer"})
    }
})

// PUT request to update a message with messageID: id
app.put('/updatemessage/:id', authenticateToken, async (req, res) => {
    try {
        const { id:messageId } = req.params
        const { offer } = req.body
        const updatedMessage = await Message.findOneAndUpdate(
            { _id: messageId },
            { $set: { offer } },
            { new: true }  // This option returns the updated document
        )
        res.status(200).json(updatedMessage)
    } catch (error) {
        res.status(500).json({error: "Error updating message"})
    }
})