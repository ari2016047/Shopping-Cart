const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;


const nodemailer = require('nodemailer');
const sendGridTranport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendGridTranport({
  auth:{
      api_key:'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'
  }
}));



class User {
  constructor(id,username, email, password, cart) {
    this._id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.cart = cart; // {items: []}
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity
      });
    }
    const updatedCart = {
      items: updatedCartItems
    };
    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(i => {
      return i.productId;
    });
    return db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then(products => {
        return products.map(p => {
          return {
            ...p,
            quantity: this.cart.items.find(i => {
              return i.productId.toString() === p._id.toString();
            }).quantity
          };
        });
      });
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });
    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: new ObjectId(this._id),
            username: this.username,
            email: this.email
          }
        };
        let str='<h2>Order Summary</h2><br><h3>Name : '+order.user.username+'</h3><br><table><tr><th>Items</th><th>Quantity</th></tr>';
        const x = order.items;
        for(let i=0;i<x.length;i++){
          str = str + '<tr><td>' + x[i].title + '</td><td>' + x[i].quantity +'</td></tr>'; 
        }
        str = str+'</table>';
        console.log('@@@!!!@@@!!!',str);

        transporter.sendMail({
          to:'arihant263@gmail.com',
          from:'tnahira263@gmail.com',
          subject:'Rama Agency!',
          html:str      
      }).then(result =>{
          console.log('Email Sent');
        })
        .catch(err =>{
          console.log(err);
        });

        return db.collection('orders').insertOne(order);
      })
      .then(result => {
        this.cart = { items: [] };
        return db
          .collection('users')
          .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      });
  }

  getOrders() {
    const db = getDb();
    return db
      .collection('orders')
      .find({ 'user._id': new ObjectId(this._id) })
      .toArray();
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: new ObjectId(userId) })
      .then(user => {
        console.log(user);
        return user;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static findEmail(email){
    const db = getDb();
    return db
      .collection('users')
      .findOne({email:email})
      .then(user => {
        console.log(user);
        return user;
      })
      .catch(err => {
        console.log(err);
      })
  }
}

module.exports = User;
