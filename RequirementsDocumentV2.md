# Requirements Document - future EZElectronics

Date:

Version: V1—description of EZElectronics in FUTURE form (as proposed by the team)

| Version number |                                     Change                                      |
|:--------------:|:-------------------------------------------------------------------------------:|
|      1.0       | Add Stakeholder, Stories and Personas, Functional and Non Function requirements |
|      1.1       |                         Add context diagram and images                          |
|      1.2       |                           Add use cases and glossary                            |
|      1.3       |                                Add GUI Prototype                                |
|      1.4       |                           Finish Requirement document                           |

# Contents

- [Requirements Document - future EZElectronics](#requirements-document---future-ezelectronics)
- [Contents](#contents)
- [Informal description](#informal-description)
- [Stakeholders](#stakeholders)
- [Context Diagram and interfaces](#context-diagram-and-interfaces)
    - [Context Diagram](#context-diagram)
    - [Interfaces](#interfaces)
- [Stories and personas](#stories-and-personas)
- [Functional and non functional requirements](#functional-and-non-functional-requirements)
    - [Functional Requirements](#functional-requirements)
    - [Non Functional Requirements](#non-functional-requirements)
- [Use case diagram and use cases](#use-case-diagram-and-use-cases)
    - [Use case diagram](#use-case-diagram)
- [Glossary](#glossary)
- [System Design](#system-design)
- [Deployment Diagram](#deployment-diagram)

# Informal description

EZElectronics (read EaSy Electronics) is a software application designed to help managers of electronics stores to
manage their products and offer them to customers through a dedicated website. Managers can assess the available
products, record new ones, and confirm purchases. Customers can see available products, add them to a cart and see the
history of their past purchases.

# Stakeholders

|             Stakeholder name             |                                          Description                                          |
|:----------------------------------------:|:---------------------------------------------------------------------------------------------:|
|                   User                   |       People using the website than can be either using as customers or store managers        |
|                 Visitor                  | People who are not logged in and are visiting the website to see the products and the prices  |
|                 Customer                 |     People using the website to buy electronics products from electronics store managers      |
|                 Manager                  | People who are electronics store managers and showcase their products online and manage sales |
|         EZElectronics Employees          |                      (TechAdmin, Investors, Legal team, Marketing Team)                       |
| Regulatory agencies/ Compliance agencies |       Partner agencies that EZElectronics consults in order to comply with regulations        |
|   Product suppliers and manufacturers    |   Manufacturers of electronics products from whom the store managers obtain their products    |
|               Competitors                |                  Similar companies that have a software with the same scope                   |
|             Payment Service              | People who have invested in the company and are interested in the company's financial status  |
|             Shipping Service             |            People who are responsible for delivering the products to the customers            |
|              Google Places               |                               api for verification of addresses                               |  

# Context Diagram and interfaces

## Context Diagram

![Context Diagram](assets/img/V2/CDV2.png)

## Interfaces

|           Actor            | Logical Interface |                                                           Physical Interface                                                            |
|:--------------------------:|:-----------------:|:---------------------------------------------------------------------------------------------------------------------------------------:|
|          Customer          |  PC, Smartphone   |                                                                   GUI                                                                   |
|          Manager           |  PC, Smartphone   |                                                                   GUI                                                                   |
| Tech Admin, Business Admin |  PC, Smartphone   |                                                                   GUI                                                                   |
|      Payment Service       |     Internet      | https://developer.paypal.com/api/rest/ , https://developer.visa.com/pages/working-with-visa-apis, https://developer.mastercard.com/apis |
|      Shipping Service      |     Internet      |                                                 https://www.ufficiopostale.com/api.php                                                  |
|       Google Places        |     internet      |                              https://developers.google.com/maps/documentation/places/web-service/overview                               |

# Stories and personas

Persona 1:

- Marco, 35 Male, with some computer science and tech background, store manager for over a decade

Story:

- Marco stumbled upon EZElectronics while searching for inventory management solutions. The user-friendly interface and
  features like automatic website updates and purchase confirmation caught Marco’s attention. With EZElectronics, Marco
  can now efficiently manage inventory, update the store's website, and provide a seamless shopping experience for
  customers.

Persona 2:

- Anna, a 28 Female, newly opened her own electronics shop, has very little time on her hands.

Story:

- Anna heard about EZElectronics from a fellow business owner and decided to give it a try. The simplicity of the
  application allowed Anna to quickly get up and running. Now, Anna can easily add new products, track inventory, and
  manage customer orders without spending hours on paperwork. EZElectronics has become an invaluable tool in helping
  Anna grow her business.

Persona 3:

- Emilia, 25 Female, a Frequent Online Shopper, is a tech enthusiast who loves to stay updated with the latest gadgets.
  With a busy schedule, Emilia prefers shopping online for convenience.

Story:

- Emilia discovered EZElectronics while browsing for new gadgets online. The user-friendly website interface and wide
  range of products caught Emilia’s attention. Now, Emilia can easily browse through available products, add them to her
  cart, and track her purchase history. With EZElectronics, Emilia enjoys a hassle-free shopping experience and can
  quickly get her hands on the latest tech gadgets.

Persona 4:

- Donald, 40 Male, Retail Operations Manager, oversees multiple electronics stores for a retail chain. With stores
  located across different regions, keeping track of inventory and managing purchases manually has become a daunting
  task.

Story:

- Donald was tasked with finding a centralized solution to streamline inventory management and online sales for the
  retail chain. After researching various options, Donald chose EZElectronics for its comprehensive features and
  scalability. With EZElectronics, Donald can now efficiently manage inventory across multiple stores, track sales
  performance, and ensure a seamless shopping experience for customers.

Persona 5:

- Lisa, 32, a Female, Stay-at-home Parent Turned Entrepreneur, has recently become a stay-at-home parent after having
  her second child. Wanting to contribute to the household income while taking care of her children, Lisa decided to
  start an online electronics store.

Story:

- Lisa faced many challenges in setting up her online store, from managing inventory to attracting customers. However,
  EZElectronics came to the rescue with its user-friendly platform and helpful features. Now, Lisa can easily manage her
  store, add new products, and fulfill orders, all while taking care of her children. EZElectronics has empowered Lisa
  to pursue her entrepreneurial dreams while balancing her family responsibilities.

# Functional and non functional requirements

## Functional Requirements

|   ID    |                  Description                   |
|:-------:|:----------------------------------------------:|
|   FR1   |                 Create account                 |
|  FR1.1  |            Create customer account             |
|  FR1.2  |             Create manager account             |
|  FR1.3  |           Create tech admin account            |
|   FR2   |                Manage products                 |
|  FR2.1  |                 Create product                 |
|  FR2.2  |               Register arrivals                |
|  FR2.5  |          List all available products           |
| FR2.5.1 |  filter available products based on category   |
| FR2.5.2 |    filter available products based on model    |
| FR2.5.3 | filter available products based on sold status |
|  FR2.6  |        Delete specific product by code         |
|  FR2.7  |           Get store by product code            |
|  FR2.8  |                  Change store                  |
|  FR2.9  |            List all owned products             |
| FR2.9.1 |  filter all owned products based on category   |
| FR2.9.2 |    filter all owned products based on model    |
| FR2.9.3 |     filter all owned products already sold     |
| FR2.9.4 |  filter all owned products available to sell   |
|   FR3   |        Authorization and authentication        |
|  FR3.1  |                     login                      |
|  FR3.2  |                     logout                     |
|  FR3.3  |            Get current Session Info            |
|   FR4   |                Cart Management                 |
|  FR4.1  | Access and view current cart of logged in user |
|  FR4.2  |          Add product to cart by code           |
|  FR4.3  |            Delete product from cart            |
|  FR4.4  |                Pay for the cart                |
|  FR4.5  |          List and access cart history          |
|  FR4.6  |                Delete the cart                 |
|  FR4.7  |                  Request cart                  |
|   FR5   |                 Manage stores                  |
|  FR5.1  |               Create a new Store               |
|  FR5.2  |          Change Store’s information's          |
|  FR5.3  |                  Delete store                  |
|   FR6   |                 Manage Account                 |
|  FR6.1  |             Change Account details             |
|  FR6.2  |                Forgot Password                 |
|   FR7   |                 Manage payment                 | 
|  FR7.1  |               Add payment method               |
|  FR7.2  |                  Make payment                  |
|   FR8   |                Manage shipping                 |
|  FR8.1  |            calculate shipping cost             |
|  FR8.2  |                 verify address                 |
|  FR8.3  |  submit shipping request to shipping service   |
|   FR9   |                  Manage users                  |
|  FR9.1  |              get user by username              |
|  FR9.2  |            delete user by username             |
|  FR9.3  |              filter user by role               |
|   F10   |               Privacy Management               |
|  F10.1  |             Show legal constraints             |
|  F10.2  |              Ask user permissions              |
|  F10.3  | Allow user to change permissions at any moment |


## Non Functional Requirements

|  ID  | Type (efficiency, reliability, ..) |                                                                                                          Description                                                                                                          |     Refers to     |
|:----:|:----------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-----------------:|
| NFR1 |             Usability              |                                The user interface should be friendly enough so that the customers become able to navigate around the website and use all the functionalities under 15 minutes                                 | FR1,FR2, FR3, FR4 |
| NFR2 |             Efficiency             |                                                                    The page should respond and be navigable in 0.5 second regardless of network latencies.                                                                    | FR1,FR2, FR3, FR4 |
| NFR3 |             Efficiency             |                                                                                            Ram occupation should be under 300 MB.                                                                                             | FR1,FR2, FR3, FR4 |
| NFR4 |            Reliability             |                                                          Number of defects and failures during transactions should be less than 1% of the total amount of tentative.                                                          |   FR4.4, FR9.9    |
| NFR5 |            Portability             | Should be available as a web app (and have proper browser support and possibility to be viewed on old machines) Universal/legacy browser compatibility: Chrome 123.0.0, Firefox 125.0.1,  Safari 17.4.1, Internet explorer 11 | FR1,FR2, FR3, FR4 |
| NFR6 |              Security              |                         payments should be made through secure payment gateways, all the data should be encrypted, and the website should be protected against SQL injection, XSS, and CSRF attacks.                          |        FR7        |
# Use case diagram and use cases

## Use case diagram

![Use Case Diagram](assets/img/V2/UCDV2.png)

## Use cases

### Create Account user, UC1 - FR1

| Actors Involved  |                             User                              |
|:----------------:|:-------------------------------------------------------------:|
|   Precondition   |                  User does not have account                   |
|  Post condition  |                               -                               |
| Nominal Scenario |            Scenario 1.1 (create customer account)             |
|     Variants     |             Scenario 1.2 (create manager account)             |
|    Exceptions    | Scenario 1.3 (username exists), Scenario 1.4 (invalid fields) |

##### Scenario 1.1 (create customer account) - FR1.2

|  Scenario 1.1  |                                                                            |
|:--------------:|:--------------------------------------------------------------------------:|
|  Precondition  |                         User does not have account                         |
| Post condition |                         User has customer account                          |
|     Step#      |                                Description                                 |
|       1        |                         user selects role customer                         |
|       2        |          user enters username, name, email, surname and password           |
|       3        |            database searched for username, duplicate not found             |
|       4        |       input fields are validated, they are conforming to constraints       |
|       5        |              database searched for email, duplicate not found              |
|       6        | System sends a verification code to the specified email and ask it to user |
|       7        |                      user sends the code, right code                       |
|       8        |            FR1.1: A customer account gets created for the user             |

##### Scenario 1.2 (create manager account) - FR1.1

|  Scenario 1.2  |                                                                            |
|:--------------:|:--------------------------------------------------------------------------:|
|  Precondition  |                         User does not have account                         |
| Post condition |                          User has manager account                          |
|     Step#      |                                Description                                 |
|       1        |                         user selects role Manager                          |
|       2        |          user enters username, name, email, surname and password           |
|       3        |            database searched for username, duplicate not found             |
|       4        |       input fields are validated, they are conforming to constraints       |
|       5        |              database searched for email, duplicate not found              |
|       6        | System sends a verification code to the specified email and ask it to user |
|       7        |                      user sends the code, right code                       |
|       8        |             FR1.2: A Manager account gets created for the user             |

##### Scenario 1.3 (username exists)

|  Scenario 1.3  |                                                         |
|:--------------:|:-------------------------------------------------------:|
|  Precondition  |               User does not have account                |
| Post condition |               User does not have account                |
|     Step#      |                       Description                       |
|       1        |                user selects role Manager                |
|       2        | user enters username, name, email, surname and password |
|       3        |     database searched for username, duplicate found     |
|       4        |   show error saying that the username already exists    |
|       5        |          user remains in account creation page          |

##### Scenario 1.4 (invalid fields)

|  Scenario 1.4  |                                                                    |
|:--------------:|:------------------------------------------------------------------:|
|  Precondition  |                     User does not have account                     |
| Post condition |                     User does not have account                     |
|     Step#      |                            Description                             |
|       1        |                     user selects role Manager                      |
|       2        |      user enters username, name, email, surname and password       |
|       3        |        database searched for username, duplicate not found         |
|       4        | input fields are validated, they not are conforming to constraints |
|       5        |   show error saying that the are problems with the input fields    |
|       6        |               user remains in account creation page                |


##### Scenario 1.5 (email already exists) 

|  Scenario 1.5  |                                                                |
|:--------------:|:--------------------------------------------------------------:|
|  Precondition  |                   User does not have account                   |
| Post condition |                   User does not have account                   |
|     Step#      |                          Description                           |
|       1        |                   user selects role customer                   |
|       2        |    user enters username, name, email, surname and password     |
|       3        |      database searched for username, duplicate not found       |
|       4        | input fields are validated, they are conforming to constraints |
|       5        |          database searched for email, duplicate found          |
|       6        | show error saying that the are problems with the input fields  |
|       7        |             user remains in account creation page              |

##### Scenario 1.6 (wrong verification code) 

|  Scenario 1.6  |                                                                            |
|:--------------:|:--------------------------------------------------------------------------:|
|  Precondition  |                         User does not have account                         |
| Post condition |                         User does not have account                         |
|     Step#      |                                Description                                 |
|       1        |                         user selects role customer                         |
|       2        |          user enters username, name, email, surname and password           |
|       3        |            database searched for username, duplicate not found             |
|       4        |   FR1.3: input fields are validated, they are conforming to constraints    |
|       5        |              database searched for email, duplicate not found              |
|       6        | System sends a verification code to the specified email and ask it to user |
|       7        |                      user sends the code, right code                       |
|       8        |       show error saying that the are problems with the input fields        |
|       9        |                   user remains in account creation page                    |

### Login, UC2 - FR3.1

| Actors Involved  |                       User                       |
|:----------------:|:------------------------------------------------:|
|   Precondition   |                user not logged in                |
|  Post condition  |                        -                         |
| Nominal Scenario |                   Scenario 2.1                   |
|     Variants     |                        -                         |
|    Exceptions    | Scenario 2.2 (username and password don't match) |

##### Scenario 2.1

|  Scenario 2.1  |                                                                  |
|:--------------:|:----------------------------------------------------------------:|
|  Precondition  |                        user not logged in                        |
| Post condition |                          user logged in                          |
|     Step#      |                           Description                            |
|       1        |                user enters username and password                 |
|       2        | database searched for username, check password, password matched |
|       3        |                    FR3.1: user gets logged in                    |

##### Scenario 2.2 (username and password don't match)

|  Scenario 2.2  |                                                                        |
|:--------------:|:----------------------------------------------------------------------:|
|  Precondition  |                           user not logged in                           |
| Post condition |                           user not logged in                           |
|     Step#      |                              Description                               |
|       1        |                   user enters username and password                    |
|       2        | database searched for username, check password, password doesn't match |
|       3        |                      user does not get logged in                       |

### Logout, UC3 - FR3.2

| Actors Involved  |        User        |
|:----------------:|:------------------:|
|   Precondition   |   user logged in   |
|  Post condition  | user not logged in |
| Nominal Scenario |    Scenario 3.1    |
|     Variants     |         -          |
|    Exceptions    |         -          |

##### Scenario 3.1 - FR3.2

|  Scenario 3.1  |                            |
|:--------------:|:--------------------------:|
|  Precondition  |       user logged in       |
| Post condition |     user not logged in     |
|     Step#      |        Description         |
|       1        | user asks to be logged out |
|       2        | FR3.2:user gets logged out |

### Current session info, UC4 - FR3.3

| Actors Involved  |                    User                    |
|:----------------:|:------------------------------------------:|
|   Precondition   |               user logged in               |
|  Post condition  | user receives information on their session |
| Nominal Scenario |                Scenario 4.1                |
|     Variants     |                     -                      |
|    Exceptions    |                     -                      |

##### Scenario 4.1 - FR3.3

|  Scenario 4.1  |                                               |
|:--------------:|:---------------------------------------------:|
|  Precondition  |                user logged in                 |
| Post condition |  user receives information on their session   |
|     Step#      |                  Description                  |
|       1        |     user asks to get current session info     |
|       2        | FR3.3:user receives their profile information |

### Create product , UC5 - FR2.1

| Actors Involved  |                                                                                        Manager                                                                                         |
|:----------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|   Precondition   |                                                                               user logged in as manager                                                                                |
|  Post condition  |                                                                                                                                                                                        |
| Nominal Scenario |                                                                                      Scenario 5.1                                                                                      |
|     Variants     |                     Scenario 5.2 (create product, without arrival date), Scenario 5.3 (register arrivals), Scenario 5.4 (register arrivals, without arrival date)                      |
|    Exceptions    | Scenario 5.5(create product, already existing code), Scenario 5.6(create product, arrival date after current date) , Scenario 5.7 (Register arrivals, arrival date after current date) |

##### Scenario 5.1

|  Scenario 5.1  |                                                                                      |
|:--------------:|:------------------------------------------------------------------------------------:|
|  Precondition  |                              user logged in as Manager                               |
| Post condition |                                  product is created                                  |
|     Step#      |                                     Description                                      |
|       1        | User inserts product info: code, sellingPrice, model, category, details, arrivalDate |
|       2        |                     system checks code, does not already exists                      |
|       3        |                system checks arrival date, exists and is current date                |
|       4        |             FR2.7: system validates fields, they comply with constraints             |
|       5        |                                FR2.1:product created                                 |

##### Scenario 5.2 (create product, without arrival date)

|  Scenario 5.2  |                                                                         |
|:--------------:|:-----------------------------------------------------------------------:|
|  Precondition  |                        user logged in as Manager                        |
| Post condition |                           product is created                            |
|     Step#      |                               Description                               |
|       1        | User inserts product info: code, sellingPrice, model, category, details |
|       2        |               system checks code, does not already exists               |
|       3        |               system checks arrival date, does not exist                |
|       4        |                system sets arrival date to current date                 |
|       5        |      FR2.7: system validates fields, they comply with constraints       |
|       6        |                          FR2.1:product created                          |

##### Scenario 5.3 (register arrivals) - FR2.2

|  Scenario 5.3  |                                                                                                     |
|:--------------:|:---------------------------------------------------------------------------------------------------:|
|  Precondition  |                                      user logged in as Manager                                      |
| Post condition |                                       arrivals are registered                                       |
|     Step#      |                                             Description                                             |
|       1        | manager inserts arrival product info: model, sellingPrice, category, details, arrivalDate, quantity |
|       3        |                       system checks arrival date, exists and is current date                        |
|       4        |                    FR2.7: system validates fields, they comply with constraints                     |
|       5        |                                      FR2.2:arrival registered                                       |

##### Scenario 5.4 (register arrivals, without arrival date)

|  Scenario 5.4  |                                                                                        |
|:--------------:|:--------------------------------------------------------------------------------------:|
|  Precondition  |                               user logged in as Manager                                |
| Post condition |                                arrivals are registered                                 |
|     Step#      |                                      Description                                       |
|       1        | manager inserts arrival product info: model, category, sellingPrice, details, quantity |
|       3        |                       system checks arrival date, does not exist                       |
|       4        |                        system sets arrival date to current date                        |
|       5        |              FR2.7: system validates fields, they comply with constraints              |
|       6        |                               FR2.2:arrivals registered                                |

##### Scenario 5.5 (create product, already existing code)

|  Scenario 5.5  |                                                                                      |
|:--------------:|:------------------------------------------------------------------------------------:|
|  Precondition  |                              user logged in as Manager                               |
| Post condition |                                product is not created                                |
|     Step#      |                                     Description                                      |
|       1        | User inserts product info: code, sellingPrice, model, category, details, arrivalDate |
|       2        |                          system checks code, already exists                          |
|       3        |              system shows error describing that the code already exists              |
|       4        |                 product not added, user remains on add product page                  |

##### Scenario 5.6 (create product, arrival date after current date)

|  Scenario 5.6  |                                                                                      |
|:--------------:|:------------------------------------------------------------------------------------:|
|  Precondition  |                              user logged in as Manager                               |
| Post condition |                                product is not created                                |
|     Step#      |                                     Description                                      |
|       1        | User inserts product info: code, sellingPrice, model, category, details, arrivalDate |
|       2        |                     system checks code, does not already exists                      |
|       3        |                  system checks arrival date, is after current date                   |
|       4        |           system shows error describing that the arrivalDate is incorrect            |
|       5        |                 product not added, user remains on add product page                  |

##### Scenario 5.7 (register arrivals, arrival date after current date)

|  Scenario 5.7  |                                                                                                     |
|:--------------:|:---------------------------------------------------------------------------------------------------:|
|  Precondition  |                                      user logged in as Manager                                      |
| Post condition |                                         products are added                                          |
|     Step#      |                                             Description                                             |
|       1        | manager inserts arrival product info: model, category, sellingPrice, details, arrivalDate, quantity |
|       3        |                    system checks arrival date, exists and is after current date                     |
|       4        |                   system shows error describing that the arrivalDate is incorrect                   |
|       5        |                      arrivals not registered, user remains on add product page                      |

### Get products, UC6 - FR2.5

| Actors Involved  |                                                                                                                                              User (Customer or Manager)                                                                                                                                              |
|:----------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|   Precondition   |                                                                                                                                                    user logged in                                                                                                                                                    |
|  Post condition  |                                                                                                                                                          -                                                                                                                                                           |
| Nominal Scenario |                                                                                                                                           Scenario 7.1 (get all products)                                                                                                                                            |
|     Variants     | Scenario 7.2 (get all products and filter products based on category) ,Scenario 7.3 (get all products and filter products based on model), Scenario 7.4 (get all products and filter products based on category and sold status), Scenario 7.5 (get all products and filter products based on model and sold status) | 
|    Exceptions    |                                                                                                                                        Scenario 7.6 (product does not exists)                                                                                                                                        |

##### Scenario 6.1 (get all products)

|  Scenario 6.1  |                                   |
|:--------------:|:---------------------------------:|
|  Precondition  |          user logged in           |
| Post condition |         List all products         |
|     Step#      |            Description            |
|       1        | User requests to get all products |
|       2        | FR2.5:system returns all products |

##### Scenario 6.2 (get all products and filter products based on category)

|  Scenario 6.2  |                                                         |
|:--------------:|:-------------------------------------------------------:|
|  Precondition  |                     user logged in                      |
| Post condition |       get all products filtered based on category       |
|     Step#      |                       Description                       |
|       1        | User requests to get all products in a certain category |
|       2        |  FR2.5.1:system returns all products in that category   |

##### Scenario 6.3 (get all products and filter products based on model)

|  Scenario 6.3  |                                                      |
|:--------------:|:----------------------------------------------------:|
|  Precondition  |                    user logged in                    |
| Post condition |       get all products filtered based on model       |
|     Step#      |                     Description                      |
|       1        | User requests to see all products of a certain model |
|       2        |  FR2.5.2:system returns all products of that model   |

##### Scenario 6.4 (get all products and filter products based on category and sold status)

|  Scenario 6.4  |                                                                         |
|:--------------:|:-----------------------------------------------------------------------:|
|  Precondition  |                             user logged in                              |
| Post condition |       get all products filtered based on category and sold status       |
|     Step#      |                               Description                               |
|       1        | User requests to see all products in a certain category and sold status |
|       2        |      system returns all products in that category and sold status       |

##### Scenario 6.5 (get all products and filter products based on model and sold status)

|  Scenario 6.5  |                                                                      |
|:--------------:|:--------------------------------------------------------------------:|
|  Precondition  |                            user logged in                            |
| Post condition |       get all products filtered based on model and sold status       |
|     Step#      |                             Description                              |
|       1        | user requests to see all products of a certain model and sold status |
|       2        |      system returns all products of that model and sold status       |

##### Scenario 6.6 (product does not exists)

|  Scenario 6.6  |                                                        |
|:--------------:|:------------------------------------------------------:|
|  Precondition  |                     user logged in                     |
| Post condition |                 products not returned                  |
|     Step#      |                      Description                       |
|       1        |                User enters product code                |
|       2        |          system searches for product by code           |
|       3        | system does not find product and returns error message |

##### Scenario 6.7 (get product by code) - FR2.4
|  Scenario 6.7  |                                           |
|:--------------:|:-----------------------------------------:|
|  Precondition  |              user logged in               |
| Post condition |           products not returned           |
|     Step#      |                Description                |
|       1        |         User enters product code          |
|       2        |    system searches for product by code    |
|       3        | system finds product and returns its info |

### Delete Product, UC7

| Actors Involved  |          Manager          |
|:----------------:|:-------------------------:|
|   Precondition   | user logged in as manager |
|  Post condition  |                           |
| Nominal Scenario |       Scenario 7.1        |
|     Variants     |             -             |
|    Exceptions    |       Scenario 7.2        |

##### Scenario 7.1

|  Scenario 7.1  |                                                                          |
|:--------------:|:------------------------------------------------------------------------:|
|  Precondition  |                        user logged in as manager                         |
| Post condition |                            product is deleted                            |
|     Step#      |                               Description                                |
|       1        |                Manager enters product code to be deleted                 |
|       2        |                   system searches for product by code                    |
|       3        | system verify the product is located in a store owned by the manager, ok |
|       4        |                        system deletes the product                        |

##### Scenario 7.2

|  Scenario 7.2  |                                           |
|:--------------:|:-----------------------------------------:|
|  Precondition  |         user logged in as manager         |
| Post condition |          product is not deleted           |
|     Step#      |                Description                |
|       1        | Manager enters product code to be deleted |
|       2        |    system searches for product by code    |
|       3        |       system does not find product        |
|       4        |       system returns error message        |

### Manage cart, UC8 - FR4.1

| Actors Involved  |                                                                                                                                                                                                                                                                             Customer                                                                                                                                                                                                                                                                              |
|:----------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|   Precondition   |                                                                                                                                                                                                                                                                    user logged in as customer                                                                                                                                                                                                                                                                     |
|  Post condition  |                                                                                                                                                                                                                                                                                 -                                                                                                                                                                                                                                                                                 |
| Nominal Scenario |                                                                                                                                                                                                                                                                     Scenario 8.1 (View cart)                                                                                                                                                                                                                                                                      |
|     Variants     |                                                                                                                                                                                                        Scenario 8.2 (add product to cart) ,Scenario 8.3 (delete product from cart) ,Scenario 8.4 (list and access cart history), Scenario 8.8(delete cart)                                                                                                                                                                                                        |
|    Exceptions    | Scenario 8.4 (product does not exist), Scenario 8.5 (add product to cart, product is in another cart), Scenario 8.6 (add product to cart, product is in another cart) , Scenario 8.7 (add product to cart, product is sold), Scenario 8.8 (delete product from cart, product does not exist), Scenario 8.9 (delete product from cart, customer does not have cart), Scenario 8.10 (delete product from cart, product does not exist in cart), , Scenario 8.12 (delete current cart, no cart to delete), Scenario 8.13 (delete product from cart, product is sold) |

##### Scenario 8.1 (get current cart info)

|  Scenario 8.1  |                                             |
|:--------------:|:-------------------------------------------:|
|  Precondition  |         user logged in as customer          |
| Post condition |            cart info is returned            |
|     Step#      |                 Description                 |
|       1        | customer requests to see their current cart |
|       2        |          system returns cart info           |

##### Scenario 8.2 (add product to cart) — FR4.2

|  Scenario 8.2  |                                                        |
|:--------------:|:------------------------------------------------------:|
|  Precondition  |    user logged in as customer, customer has a cart     |
| Post condition |         product is added to the customer cart          |
|     Step#      |                      Description                       |
|       1        |    customer enters product code to be added to cart    |
|       2        |  system searches for product by code, product exists   |
|       3        | system checks if product is in another cart, it is not |
|       4        |      system checks if product is sold, it is not       |
|       5        |         product is added to the customer cart          |

##### Scenario 8.3 (delete product from cart)- FR4.3

|  Scenario 8.3  |                                                                   |
|:--------------:|:-----------------------------------------------------------------:|
|  Precondition  |                    user logged in as customer                     |
| Post condition |               product is deleted from customer cart               |
|     Step#      |                            Description                            |
|       1        | customer enters product code to be deleted from the customer cart |
|       2        |           system checks if customer has a cart, they do           |
|       3        |   system checks if product with code exists in catalog, it does   |
|       4        |         system checks that the product exists in the cart         |
|       5        |   system checks that the product is not sold already, it is not   |
|       6        |             product is deleted from the customer cart             |

##### Scenario 8.4 (get cart history) — FR4.5

|  Scenario 8.4  |                                                                    |
|:--------------:|:------------------------------------------------------------------:|
|  Precondition  |                     user logged in as customer                     |
| Post condition |                   customer cart history returned                   |
|     Step#      |                            Description                             |
|       1        |            customer requests to see their cart history             |
|       2        | system checks that customer has previously paid for carts, they do |
|       3        |                system returns customer cart history                |

##### Scenario 8.5 (add product to cart, product does not exist) — FR4.2

|  Scenario 8.5  |                                                              |
|:--------------:|:------------------------------------------------------------:|
|  Precondition  |       user logged in as customer, customer has a cart        |
| Post condition |            product is not added to customer cart             |
|     Step#      |                         Description                          |
|       1        |       customer enters product code to be added to cart       |
|       2        | system searches for product by code, product does not exist  |
|       3        | system returns error message that the product does not exist |
|       4        |          product is not added to the customer cart           |

##### Scenario 8.6 (add product to cart, product is in another cart) — FR4.2

|  Scenario 8.6  |                                                                  |
|:--------------:|:----------------------------------------------------------------:|
|  Precondition  |         user logged in as customer, customer has a cart          |
| Post condition |              product is not added to customer cart               |
|     Step#      |                           Description                            |
|       1        |         customer enters product code to be added to cart         |
|       2        |       system searches for product by code, product exists        |
|       3        |        system checks if product is in another cart, it is        |
|       4        | system returns error message that the product is in another cart |
|       5        |            product is not added to the customer cart             |

##### Scenario 8.7 (add product to cart, product is sold)  — FR4.2

|  Scenario 8.7  |                                                               |
|:--------------:|:-------------------------------------------------------------:|
|  Precondition  |        user logged in as customer, customer has a cart        |
| Post condition |             product is not added to customer cart             |
|     Step#      |                          Description                          |
|       1        |       customer enters product code to be added to cart        |
|       2        |      system searches for product by code, product exists      |
|       4        |    system checks if product is in another cart, it is not     |
|       5        |            system checks if product is sold, it is            |
|       6        | system returns error message that the product is already sold |
|       7        |           product is not added to the customer cart           |

##### Scenario 8.8 (delete product from cart, product does not exist) - FR4.3

|  Scenario 8.8  |                                                                   |
|:--------------:|:-----------------------------------------------------------------:|
|  Precondition  |                    user logged in as customer                     |
| Post condition |             no product is deleted from customer cart              |
|     Step#      |                            Description                            |
|       1        | customer enters product code to be deleted from the customer cart |
|       2        |           system checks if customer has a cart, they do           |
|       3        | system checks if product with code exists in catalog, it does not |
|       4        |   system returns error message that the product does not exist    |
|       5        |             no product is deleted from customer cart              |

##### Scenario 8.9 (delete product from cart, customer does not have cart) - FR4.3

|  Scenario 8.9  |                                                                   |
|:--------------:|:-----------------------------------------------------------------:|
|  Precondition  |                    user logged in as customer                     |
| Post condition |             no product is deleted from customer cart              |
|     Step#      |                            Description                            |
|       1        | customer enters product code to be deleted from the customer cart |
|       2        |         system checks if customer has a cart, they do not         |
|       3        | system returns error message that the customer does not have cart |
|       4        |             no product is deleted from customer cart              |

##### Scenario 8.10 (delete product from cart, product does not exist in cart) - FR4.3

| Scenario 8.10  |                                                                               |
|:--------------:|:-----------------------------------------------------------------------------:|
|  Precondition  |                          user logged in as customer                           |
| Post condition |                   no product is deleted from customer cart                    |
|     Step#      |                                  Description                                  |
|       1        |       customer enters product code to be deleted from the customer cart       |
|       2        |                 system checks if customer has a cart, they do                 |
|       3        |         system checks if product with code exists in catalog, it not          |
|       4        |   system returns checks if the product exists in customer cart, it does not   |
|       5        | system returns error message that the product does not exist in customer cart |
|       6        |                   no product is deleted from customer cart                    |

##### Scenario 8.11(delete current cart) - FR4.6

| Scenario 8.11  |                                                 |
|:--------------:|:-----------------------------------------------:|
|  Precondition  |           user logged in as customer            |
| Post condition |            customer cart is deleted             |
|     Step#      |                   Description                   |
|       1        | customer requests to delete their current cart  |
|       2        | system checks that customer has a cart, they do |
|       3        |        system deletes the customer cart         |

##### Scenario 8.12 (no cart to delete) - FR4.6

| Scenario 8.12  |                                                            |
|:--------------:|:----------------------------------------------------------:|
|  Precondition  |                 user logged in as customer                 |
| Post condition |                customer cart is not deleted                |
|     Step#      |                        Description                         |
|       1        |       customer requests to delete their current cart       |
|       2        |    system checks that customer has a cart, they do not     |
|       3        | system returns error message that the customer has no cart |

##### Scenario 8.13 (delete product from cart, product is sold) - FR4.3

| Scenario 8.13  |                                                                     |
|:--------------:|:-------------------------------------------------------------------:|
|  Precondition  |                     user logged in as customer                      |
| Post condition |              no product is deleted from customer cart               |
|     Step#      |                             Description                             |
|       1        |  customer enters product code to be deleted from the customer cart  |
|       2        |            system checks if customer has a cart, they do            |
|       3        |    system checks if product with code exists in catalog, it does    |
|       4        |    system returns error message that the product does not exist     |
|       5        |      system checks that the product is not sold already, it is      |
|       6        | system returns error message that the product has already been sold |
|       5        |              no product is deleted from customer cart               |

### Payment of the cart, UC9

| Actors Involved  |                            Customer, Manager                             |
|:----------------:|:------------------------------------------------------------------------:|
|   Precondition   |                        user logged in as customer                        |
|  Post condition  |                                                                          |
| Nominal Scenario |                              Scenario 17.1                               |
|     Variants     |                                    -                                     |
|    Exceptions    |                       Scenario 17.2, Scenario 17.3                       |

##### Scenario 9.1

|    Scenario    |                                   9.1                                    |
|:--------------:|:------------------------------------------------------------------------:|
|  Precondition  |                       	User logged in as customer                        |
| Post condition |                              	Cart is sold                               |
|      Step      |                              #	Description                               |
|       1        |        	User requests to pay for the products in the current cart        |
|       2        |             	System checks if the cart is empty (it is not)              |
|       3        |            	System prompts the user to input shipping address            |
|       4        |                      	User enters shipping address                       |
|       5        |              system checks if the shipping address is valid              |
|       6        |                	System asks user to confirm the purchase                 |
|       7        |                       	User confirms the purchase                        |
|       8        |                      	User selects payment platform                      |
|       9        |              	System prompts user to input payment details               |
|       10       |                       	User enters payment details                       |
|       11       |           	System sends payment details to the payment service           |
|       12       |               	System checks if the payment is successful                |
|       13       |    	System shows the user a message confirming the successful payment    |
|       14       |                  	System groups products by store code                   |
|       15       |              	System sums the product costs for each store               |
|       16       | 	System calculates commission and detracts it from the amount to be paid |
|       17       |           	System retrieves the manager's IBAN for each store            |
|       18       |           	System makes the payment to the respective manager            |
|                |         repeats steps 17 and 18 each store manager in the groups         |
|       20       |                      	System marks the cart as sold                      |

### Manage users - UC10

##### Scenario 10.1(list all users) - FR5

| Scenario 10.1  |                                       |
|:--------------:|:-------------------------------------:|
|  Precondition  |     user logged in as tech admin      |
| Post condition |            list all users             |
|     Step#      |              Description              |
|       1        | tech admin requests to list all users |
|       2        |      FR5: system list all users       |

##### Scenario 10.2(list user by role) - FR5.1

| Scenario 10.2  |                                                              |
|:--------------:|:------------------------------------------------------------:|
|  Precondition  |                 user logged in as tech admin                 |
| Post condition |                        list all users                        |
|     Step#      |                         Description                          |
|       1        | tech admin requests to list all users filtered based on role |
|       2        |     FR5.1: system list all users with the specified role     |

##### Scenario 10.3(get user by username) - FR5.2

| Scenario 10.3  |                                                 |
|:--------------:|:-----------------------------------------------:|
|  Precondition  |          user logged in as tech admin           |
| Post condition |              list user by username              |
|     Step#      |                   Description                   |
|       1        | tech admin requests list the user by a username |
|       2        |    System checks if username exists, it does    |
|       3        |           FR5.2: system list the user           |

##### Scenario 10.4 (delete user by username) - FR6

| Scenario 10.4  |                                                      |
|:--------------:|:----------------------------------------------------:|
|  Precondition  |             user logged in as tech admin             |
| Post condition |               delete user by username                |
|     Step#      |                     Description                      |
|       1        | tech admin requests to delete the user by a username |
|       2        |      System checks if username exists, it does       |
|       3        |            FR5.2: system delete the user             |

##### Scenario 10.5 (delete user by username, user does not exist)

| Scenario 10.5  |                                                      |
|:--------------:|:----------------------------------------------------:|
|  Precondition  |             user logged in as tech admin             |
| Post condition |                   user not deleted                   |
|     Step#      |                     Description                      |
|       1        | tech admin requests to delete the user by a username |
|       2        |    System checks if username exists, it does not     |
|       3        |                      Show error                      |

##### Scenario 10.6 (get user by username, user does not exist)

| Scenario 10.6  |                                                    |
|:--------------:|:--------------------------------------------------:|
|  Precondition  |            user logged in as tech admin            |
| Post condition |                 user not returned                  |
|     Step#      |                    Description                     |
|       1        | tech admin requests to list the user by a username |
|       2        |   System checks if username exists, it does not    |
|       3        |                     Show error                     |

### Forgot password, UC11
| Actors Involved  |                      Customer, Manager                       |
|------------------|:------------------------------------------------------------:| 
| Precondition     |             User has an account on EZelectronics             |
| Post condition   |                              -                               |
| Nominal Scenario |                        Scenario 11.1                         |
| Variants         |                        Scenario 11.2                         |
| Exceptions       | Scenario 11.3(incorrect code), Scenario 11.4(user not found) |

##### Scenario 1.1

| Scenario 11.1  |                                                                               |
|----------------|:-----------------------------------------------------------------------------:| 
| Precondition   |                   Customer has an account on EZelectronics                    |
| Post condition |                           Customer changed password                           |
| Step#          |                                  Description                                  |
| 1              |                      Customer requests password recovery                      |  
| 1              |                           system asks for username                            |
| 3              |                           Customer enters username                            | 
| 4              |              system searches for username, finds an existing one              | 
| 5              |                  system sends verification email to Customer                  |  
| 6              |           system requests asks Customer to enter verification code            |
| 7              |                     Customer enters the verification code                     |
| 8              |                   system checks code correctness, it is ok                    |
| 9              |                 system asks user to enter their new Password                  |
| 10             |      system validates the newly entered password, successful validation       |
| 11             | system shows a message to Customer saying that the password has been modified |

##### Scenario 11.2

| Scenario 11.2  |                                                                              |
|----------------|:----------------------------------------------------------------------------:| 
| Precondition   |                   Manager has an account on EZelectronics                    |
| Post condition |                           Manager changed password                           |
| Step#          |                                 Description                                  |
| 1              |                      Manager requests password recovery                      |  
| 1              |                           system asks for username                           |
| 3              |                           Manager enters username                            | 
| 4              |             system searches for username, finds an existing one              | 
| 5              |                 system sends verification email to Customer                  |  
| 6              |           system requests asks Manager to enter verification code            |
| 7              |                     Manager enters the verification code                     |
| 8              |                   system checks code correctness, it is ok                   |
| 9              |                 system asks user to enter their new Password                 |
| 10             |      system validates the newly entered password, successful validation      |
| 11             | system shows a message to Manager saying that the password has been modified |

##### Scenario 11.3

| Scenario 11.3  |                                                                   |
|----------------|:-----------------------------------------------------------------:| 
| Precondition   |               User has an account on EZelectronics                |
| Post condition |                    User didn't change password                    |
| Step#          |                            Description                            |
| 1              |                  User requests password recovery                  |  
| 1              |                     system asks for username                      |
| 3              |                       User enters username                        | 
| 4              |        system searches for username, finds an existing one        | 
| 5              |            system sends verification email to Customer            |  
| 6              |       system requests asks User to enter verification code        |
| 7              |                 User enters the verification code                 |
| 8              |             system checks code correctness, it is not             |
| 9              | system shows error to user, saying the verification code is wrong |

##### Scenario 11.4

| Scenario 11.4  |                                                             |
|----------------|:-----------------------------------------------------------:| 
| Precondition   |            User has an account on EZelectronics             |
| Post condition |                 User didn't change password                 |
| Step#          |                         Description                         |
| 1              |               User requests password recovery               |  
| 1              |                  system asks for username                   |
| 3              |                    User enters username                     | 
| 4              | system searches for username, does not find an existing one | 

### Change account details, UC12

| Actors Involved  |                                                                Customer, Manager                                                                |
|------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------:| 
| Precondition     |                                                              User is authenticated                                                              |
| Post condition   |                                                                                                                                                 |
| Nominal Scenario |                            Scenario 12.1, Scenario 12.1, Scenario 12.3, Scenario 12.4, Scenario 12.5,  Scenario 12.6                            |
| Variants         |                                                                  Scenario 12.7                                                                  |
| Exceptions       | Scenario 12.8(username already exists), Scenario 12.9(non-existent email), Scenario 12.10(email already used), Scenario 12.11(invalid password) |

##### Scenario 12.1 (change username)

| Scenario 12.1  |                                                                           |
|----------------|:-------------------------------------------------------------------------:| 
| Precondition   |                           User is authenticated                           |
| Post condition |                           User changed username                           |
| Step#          |                                Description                                |
| 1              |                  user requests to change account details                  |
| 2              |                        user enters a new username                         |
| 3              |         system searches for username, username does not exist, ok         | 
| 4              |                  system changes username to new username                  |
| 5              | system shows a message to User saying that the username has been modified |

##### Scenario 12.2 (change name)

| Scenario 2.2   |                                                                       |
|----------------|:---------------------------------------------------------------------:| 
| Precondition   |                         User is authenticated                         |
| Post condition |                           User changed name                           |
| Step#          |                              Description                              |
| 1              |                user requests to change account details                |
| 2              |                        user enters a new name                         |  
| 3              |                 system checks that name not null, ok                  | 
| 4              | system shows a message to User saying that the name has been modified |

##### Scenario 12.3 (change surname)

| Scenario 2.3   |                                                                          |
|----------------|:------------------------------------------------------------------------:| 
| Precondition   |                          User is authenticated                           |
| Post condition |                           User changed surname                           |
| Step#          |                               Description                                |
| 1              |                 User requests to change account details                  |
| 2              |                        User enters a new surname                         |  
| 3              |                 system checks that surname not null, ok                  | 
| 4              | system shows a message to User saying that the surname has been modified |

##### Scenario 12.4(change address)

| Scenario 12.4  |                                                                          |
|----------------|:------------------------------------------------------------------------:| 
| Precondition   |                        Customer is authenticated                         |
| Post condition |                         Customer changed address                         |
| Step#          |                               Description                                |
| 1              |               Customer requests to change account details                |
| 2              |                      Customer enters a new address                       |
| 3              |             system checks the correctness of the address, ok             | 
| 4              | system shows a message to User saying that the address has been modified |

##### Scenario 12.5 (change email)

| Scenario 12.5  |                                                                        |
|----------------|:----------------------------------------------------------------------:| 
| Precondition   |                         User is authenticated                          |
| Post condition |                           User changed email                           |
| Step#          |                              Description                               |
| 1              |                User requests to change account details                 |
| 2              |                        User enters a new e-mail                        |  
| 3              |                   search for email, not existing: ok                   | 
| 4              |                    Send verification email to User                     |  
| 5              |                       Request verification code                        |
| 6              |                   User enters the verification code                    |
| 7              |       system checks verification code correctness, it is correct       |
| 8              | system shows a message to User saying that the email has been modified |

##### Scenario 12.6 (change password)

| Scenario 2.6   |                                                                           |
|----------------|:-------------------------------------------------------------------------:| 
| Precondition   |                           User is authenticated                           |
| Post condition |                           User changed password                           |
| Step#          |                                Description                                |
| 1              |                  User requests to change account details                  |
| 1              |                        User enters a new password                         |  
| 2              |              system validates password with safety rules, ok              | 
| 3              | system shows a message to User saying that the password has been modified |

##### Scenario 12.7 (manager, change name)

| Scenario 12.7  |                                                                  |
|----------------|:----------------------------------------------------------------:| 
| Precondition   |                     Manager is authenticated                     |
| Post condition |                       Manager changed name                       |
| Step#          |                           Description                            |
| 1              |             User requests to change account details              |
| 2              |                     Manger enters a new name                     |  
| 3              |               system checks that name not null, ok               | 
| 4              | Show a message to Manager saying that the name has been modified |

##### Scenario 12.8 (change username, username already exists)

| Scenario 12.8  |                                                                    |
|----------------|:------------------------------------------------------------------:| 
| Precondition   |                       User is authenticated                        |
| Post condition |                       username not modified                        |
| Step#          |                            Description                             |
| 1              |              User requests to change account details               |
| 2              |                     User enters a new username                     |  
| 3              |       system searches for username, username already exists        | 
| 4              | system showx error to user saying that the username already exists |

##### Scenario 12.9 (change email, incorrect verification code)

| Scenario 12.9  |                                                                           |
|----------------|:-------------------------------------------------------------------------:| 
| Precondition   |                           User is authenticated                           |
| Post condition |                            email not modified                             |
| Step#          |                                Description                                |
| 1              |                  User requests to change account details                  |
| 1              |                          User enters a new email                          |  
| 2              |                     search for email, does not exist                      | 
| 3              |                      Send verification email to User                      |  
| 4              |                system asks user to enter verification code                |
| 5              |                      User input a verification code                       |
| 6              |          system check verification code correctness, not correct          |
| 7              | system shows error to user saying that the verification code is incorrect |

##### Scenario 12.10 (change email, already existing )

| Scenario 12.10 |                                    |
|----------------|:----------------------------------:| 
| Precondition   |       User is authenticated        |
| Post condition |        e-mail not modified         |
| Step#          |            Description             |
| Step#          |            Description             |
| 1              |       User provide new email       |  
| 2              | search for email, already existing | 
| 3              |            Show error.             |

##### Scenario 12.11 (change password, not safe)

| Scenario 12.11 |                                                          |
|----------------|:--------------------------------------------------------:| 
| Precondition   |                  User is authenticated                   |
| Post condition |                  password not modified                   |
| Step#          |                       Description                        |
| 1              |                User provide new password                 |  
| 2              | validate password with safety rules, rules not satisfied | 
| 3              |                        Show error                        |


### Create new Store, UC13
| Actors Involved  |                     Manager                     |
|------------------|:-----------------------------------------------:| 
| Precondition     | User has an account and is logged in as Manager |
| Post condition   |                        -                        |
| Nominal Scenario |                  Scenario 13.1                  |
| Variants         |                        -                        |
| Exceptions       |         Scenario 13.2(invalid address)          |

##### Scenario 13.1

| Scenario 3.1   |                                                                              |
|----------------|:----------------------------------------------------------------------------:| 
| Precondition   |               User has an account and is logged in as Manager                |
| Post condition |                             New Store is created                             |
| Step#          |                                 Description                                  |
| 1              |                      Manager requests to add new store                       |
| 2              |             system asks Manager to enter store name and address              |
| 3              |                    Manager enters Store name and address                     |  
| 4              |               FR8.2: system verifies address, address is valid               | 
| 5              | system shows a message to Manager saying that the new store has been Created |

##### Scenario 13.2 (invalid address)

| Scenario 3.2   |                                                                  |
|----------------|:----------------------------------------------------------------:| 
| Precondition   |         User has an account and is logged in as Manager          |
| Post condition |                   The new store is not created                   |
| Step#          |                           Description                            |
| 1              |                Manager requests to add new store                 |
| 2              |       system asks Manager to enter store name and address        |
| 3              |              Manager enters Store name and address               |  
| 4              |        FR8.2: system verifies address, address is invalid        | | 
| 5              | system shows error to manager saying that the address is invalid |

### Change Store information, UC14

| Actors Involved  |                             Manager                             |
|------------------|:---------------------------------------------------------------:| 
| Precondition     | User has an account, is logged in as Manager and owns the store |
| Post condition   |                                -                                |
| Nominal Scenario |                          Scenario 14.1                          |
| Variants         |                          Scenario 14.2                          |
| Exceptions       |               Scenario 14.3 (invalid new address)               |

##### Scenario 14.1

| Scenario 4.1   |                                                                    |
|----------------|:------------------------------------------------------------------:| 
| Precondition   |  User has an account, is logged in as Manager and owns the store   |
| Post condition |                      Store's name is modified                      |
| Step#          |                            Description                             |
| 1              |            Manager requests to change store information            |
| 2              |                Manager enters the new store's name                 |  
| 3              |                         name not null, ok                          | 
| 4              | Show a message to Manager saying that the  store has been modified |

##### Scenario 14.2

| Scenario 14.2  |                                                                    |
|----------------|:------------------------------------------------------------------:| 
| Precondition   |  User has an account, is logged in as Manager and owns the store   |
| Post condition |                    Store's address is modified                     |
| Step#          |                            Description                             |
| 1              |            Manager requests to change store information            |
| 2              |               Manager enters the new store's address               |  
| 3              |              Search for address, find an existing one              | 
| 4              | Show a message to Manager saying that the  store has been modified |

##### Scenario 14.3

| Scenario 14.3  |                                                                 |
|----------------|:---------------------------------------------------------------:| 
| Precondition   | User has an account, is logged in as Manager and owns the store |
| Post condition |               The store's address is not modified               |
| Step#          |                           Description                           |
| 1              |               Manager enters new store's address                |  
| 2              |           Search for address, address doesn't exists            | 
| 3              |                           Show error.                           |

### Delete Store, UC15

| Actors Involved  |                             Manager                             |
|------------------|:---------------------------------------------------------------:| 
| Precondition     | User has an account, is logged in as Manager and owns the store |
| Post condition   |                                -                                |
| Nominal Scenario |                          Scenario 15.1                          |
| Variants         |                                -                                |
| Exceptions       |                                -                                |

##### Scenario 15.1

| Scenario 5.1   |                                                                 |
|----------------|:---------------------------------------------------------------:| 
| Precondition   | User has an account, is logged in as Manager and owns the store |
| Post condition |                        Store is deleted                         |
| Step#          |                           Description                           |
| 1              |                Manager request to delete a store                |  
| 2              |       the system retrieves all the products of that store       | 
| 3              |           Each product of the store is deleted - F2.6           |
| 4              |                      The store is deleted                       |

### Manage admins, UC16 
| Actors Involved  |           Tech admin           |
|:----------------:|:------------------------------:|
|   Precondition   |  user logged in as tech admin  |
|  post condition  |               -                |
| Nominal Scenario | Scenario 16.1 (add tech admin) |
|     Variants     |               -                |
|    Exceptions    |               -                |

##### Scenario 16.1
| Scenario 16.1  |                                                                                                             |
|:--------------:|:-----------------------------------------------------------------------------------------------------------:|
|  Precondition  |                                        user logged in as tech admin                                         |
| Post condition |                                            tech admin user added                                            |
|     Step#      |                                                 Description                                                 |
|       1        |                                      tech admin requests to add a user                                      |
|       2        |            tech admin enters the info of the new tech admin and chooses tech admin role for them            |
|       3        |                                system adds the new tech admin to the system                                 |
|       4        | system sends email to the new tech admin with the login credentials, with instructions on changing password |

# Glossary

![Class Diagram](/assets/img/V2/CLDV2.png)

- Account: An account belonging to either a customer or a manager.
- User: user of application, could be a customer or a manager.
- Customer: A user with the role of a customer.
- Role: Specify the kind of user, either customer or manager.
- Manager: A user with the role of manager, responsible for adding products to the platform.
- Tech admin: A user with the role of tech responsible for adding tech admin and business admins to system and has access to the information the platform users and can delete them.
- Product: physical object that is added to the catalog from the manager and eventually sold to the user. A product
  could be sold or not sold, if it gets sold, it will have a selling date.
- Sell: manager sets the product’s selling date to current day.
- Pay: customer informs the system that he wants to buy the product(s) in his current cart. Then the manager of each
  product on that cart can allow or not allow the selling.
- Cart: collection of the products the customer wants to buy.

# Deployment Diagram

![Deployment Diagram](/assets/img/V2/DDV2.png)
