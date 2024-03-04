# Fullstack eCommerce Project

:computer::shopping:

## Table of Contents

- [Introduction](#introduction)
- [Architecture](#architecture)
- [Features](#features)
- [Technologies](#technologies)
- [Demo](#demo)

## Introduction

🚀 **Key Highlights:**
- **Microservices Architecture:** Engineered for scalability and maintainability.
- **Dual Frontend Applications:** A captivating store and efficient back-office interface.
- **MongoDB Atlas:** Powering our data storage with the flexibility of the cloud.

**Live Demo Link:**

  [eCommerce Store](https://rosilf.github.io/e-commerce/)
  
  [back-office application](https://rosilf.github.io/e-commerce-backoffice/)


## Architecture

- **API Gateway:** The API Gateway serves as the entry point to our system, handling incoming requests and     
  directing them to the appropriate microservices. This central hub streamlines communication, optimizes load 
  balancing, and ensures a unified interface for clients.
- **User Authentication API:** Dedicated to user management, authentication, sign-up, and login processes, the    User Authentication API microservice provides a secure and efficient solution for handling user-related 
  actions. By decoupling authentication concerns, we enhance security and scalability.
- **Order API:** The Order API microservice takes charge of order-related operations. From processing purchase     requests to updating order status, this component ensures the smooth flow of transactions throughout the     system.
- **Product and Cart Microservice:** Responsible for managing product information and cart functionalities, this microservice handles tasks related to browsing, searching, and adding products to the cart. It ensures a seamless and responsive shopping experience for our users.
<p align="center">
<img src="/eCommerceMicroservicesDesign.png" width="500">
</p>

## Features

- **Store Frontend:**
  - Catalog Page: The first page the user sees when he connects to the
    site. He will be presented with a list of all products available for sale.
    Each product includes a picture, name, price, and category. Clicking on a
    product leads to the product page.
  - Product Page: A page containing details about the product - name,
    price, category, and description. The user will be able to select a quantity and
    add the product to the shopping cart.
  - Cart: A page containing all the products in the shopping cart, and a
    summary of the cart. A user will be able to return to a specific product page and update the cart.
    He will also be able to download a product from the shopping cart.
    The user will have the option to go to the checkout page, to pay for the shopping cart.
  - Checkout: The checkout page - payment and shipping. The user will receive a summary of the order.
    The user has to fill in delivery details - name and address, as well as credit
    details for payment. Clicking on payment sends a payment request to a third-party demo payment company.
    
- **Back-Office Frontend:**
  - The products page: shows all the products available in stock. Clicking on a product will lead to the product
     page, where an administrator can update and edit it accordingly. Also, those who have permission - will be able
     to delete the product. In addition, there will be a button that allows you to add a new product
  - The product editing page / adding a new product: which includes all the editable fields for a product. You can reach
     this page in the edit mode of an existing product, or in add mode of a new product.
  - The orders page: here you can be in control of all orders placed. Each order has 2 statuses - waiting for delivery,
     or shipping. The system administrator can update an order that has already reached its destination.
     When an order goes to the "shipped" state, it cannot return to the pending state.

## Technologies

- **Microservices (Backend):**
  - [Node.js](https://nodejs.org/)
  - [Express](https://expressjs.com/)
  - [JWT](https://www.npmjs.com/package/jsonwebtoken)
  - [RabbitMQ](https://www.rabbitmq.com/)

- **Store & Back-Office Frontend:**
  - [React](https://reactjs.org/)
  - [Redux](https://redux.js.org/)
  - [React Router DOM](https://www.npmjs.com/package/react-router-dom)

- **Database:**
  - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

- **Deployment:**
  - [Render](https://render.com/)
  - [GitHub Pages](https://pages.github.com/)

## Demo
Experience the full-stack eCommerce project by exploring our live demo.
Interact with the store and back-office applications to get a hands-on feel of the features and functionalities.
  
  [eCommerce Store](https://rosilf.github.io/e-commerce/)
  
  [back-office application](https://rosilf.github.io/e-commerce-backoffice/)


