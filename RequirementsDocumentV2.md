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
        - [Use case 1, UC1](#use-case-1-uc1)
            - [Scenario 1.1](#scenario-11)
            - [Scenario 1.2](#scenario-12)
            - [Scenario 1.x](#scenario-1x)
        - [Use case 2, UC2](#use-case-2-uc2)
        - [Use case x, UCx](#use-case-x-ucx)
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

# Context Diagram and interfaces

## Context Diagram

\<Define here Context diagram using UML use case diagram>

\<actors are a subset of stakeholders>

## Interfaces

\<describe here each interface in the context diagram>

\<GUIs will be described graphically in a separate document>

|   Actor   | Logical Interface | Physical Interface |
|:---------:|:-----------------:|:------------------:|
| Actor x.. |                   |                    |

# Stories and personas

\<A Persona is a realistic impersonation of an actor. Define here a few personas and describe in plain text how a
persona interacts with the system>

\<Persona is-an-instance-of actor>

\<stories will be formalized later as scenarios in use cases>

# Functional and non functional requirements

## Functional Requirements
|   ID    |                  Description                   |
|:-------:|:----------------------------------------------:|
|   FR1   |            Manage Account Customer             |
|  FR1.1  |            Create account Customer             |
|  FR1.2  |                Validate fields                 |
|   FR2   |                Manage Products                 |
|  FR2.1  |                 Create Product                 |
|  FR2.2  |               Register Arrivals                |
|  FR2.3  |              Approve Transaction               |
|  FR2.4  |              Find product by code              |
|  FR2.5  |               List all products                |
| FR2.5.1 |       filter products based on category        |
| FR2.5.1 |         filter products based on model         |
| FR2.5.1 |      filter products based on sold status      |
|  FR2.6  |        Delete specific product by code         |
|  FR2.7  |           Get store by product code            |
|  FR2.8  |                  Change store                  |
|   FR3   |        Authorization and authentication        |
|  FR3.1  |                     login                      |
|  FR3.2  |                     logout                     |
|  FR3.3  |            Get current Session Info            |
|   FR4   |                Cart Management                 |
|  FR4.1  | Access and view current cart of logged in user |
|  FR4.2  |    Add product to cart by productId (code)     |
|  FR4.3  |            Delete product from cart            |
|  FR4.4  |                Pay for the cart                |
| FR4.4.1 |      Sum cost of all products in the cart      |
|  FR4.5  |          List and access cart history          |
| FR4.5.1 |            Find all previous carts             |
|  FR4.6  |                Delete the cart                 |
|  FR4.7  |                  Request cart                  |
|   FR5   |             Manage Account Manager             |
|  FR5.1  |             Create account Manager             |
|   FR6   |          Refund and manager Payments           |
|  FR6.1  |         Allow user to request a refund         |
|  FR6.2  |                Authorize refund                |
|  FR6.3  |              Payment of customer               |
|   FR7   |                 Manage stores                  |
|  FR7.1  |               Create a new Store               |
|  FR7.2  |          Change Store’s information's          |
|  FR7.3  |                  Delete store                  |
|   FR8   |         Manage Account’s information's         |
|  FR8.1  |             Change Account details             |
|  FR8.2  |                Forgot Password                 |


## Non Functional Requirements

\<Describe constraints on functional requirements>

|   ID    | Type (efficiency, reliability, ..) | Description | Refers to |
|:-------:|:----------------------------------:|:-----------:|:---------:|
|  NFR1   |                                    |             |           |
|  NFR2   |                                    |             |           |
|  NFR3   |                                    |             |           |
| NFRx .. |                                    |             |           |

# Use case diagram and use cases

## Use case diagram

\<define here UML Use case diagram UCD summarizing all use cases, and their relationships>

## Use cases

### Forgot password, UC1

| Actors Involved  |                      Customer, Manager                       |
|------------------|:------------------------------------------------------------:| 
| Precondition     |             User has an account on Ezelectronics             |
| Post condition   |                              -                               |
| Nominal Scenario |                         Scenario 1.1                         |
| Variants         |                         Scenario 1.2                         |
| Exceptions       | Scenario 1.3(incorrect code), Scenario 1.4(user not founded) |

##### Scenario 1.1

| Scenario 1.1   |                                                                       |
|----------------|:---------------------------------------------------------------------:| 
| Precondition   |               Customer has an account on ezelectronics                |
| Post condition |                       Customer changed password                       |
| Step#          |                              Description                              |
| 1              |                       Customer provide username                       |  
| 2              |               Search for username, find an existing one               | 
| 3              |                  Send verification email to Customer                  |  
| 4              |                       Request verification code                       |
| 5              |                  Customer input a verification code                   |
| 6              |                         Check correctness, ok                         |
| 7              |                         Request new Password                          |
| 8              |             Validate the password, successful validation              |
| 9              | Show a message to Customer saying that the password has been modified |

##### Scenario 1.2

| Scenario 1.2   |                                                                      |
|----------------|:--------------------------------------------------------------------:| 
| Precondition   |               Manager has an account on ezelectronics                |
| Post condition |                       Manager changed password                       |
| Step#          |                             Description                              |
| 1              |                       Manager provide username                       |  
| 2              |              Search for username, find an existing one               | 
| 3              |                  Send verification email to Manager                  |  
| 4              |                      Request verification code                       |
| 5              |                  Manager input a verification code                   |
| 6              |                        Check correctness, ok                         |
| 7              |                         Request new Password                         |
| 8              |             Validate the password, successful validation             |
| 9              | Show a message to Manager saying that the password has been modified |

##### Scenario 1.3

| Scenario 1.3   |                                           |
|----------------|:-----------------------------------------:| 
| Precondition   |   User has an account on ezelectronics    |
| Post condition |        User didn't change password        |
| Step#          |                Description                |
| 1              |           User provide username           |  
| 2              | Search for username, find an existing one | 
| 3              |      Send verification email to User      |  
| 4              |         Request verification code         |
| 5              |      User input a verification code       |
| 6              |      Check correctness, not correct       |
| 7              |                Show error                 |

##### Scenario 1.4

| Scenario 1.4   |                                      |
|----------------|:------------------------------------:| 
| Precondition   | User has an account on ezelectronics |
| Post condition |     User didn't change password      |
| Step#          |             Description              |
| 1              |        User provide username         |  
| 2              |    Search for username, not found    | 
| 3              |              Show error              |

### Change account details, UC2

| Actors Involved  |                                                             Customer, Manager                                                              |
|------------------|:------------------------------------------------------------------------------------------------------------------------------------------:| 
| Precondition     |                                                           User is authenticated                                                            |
| Post condition   |                                                                                                                                            |
| Nominal Scenario |                            Scenario 2.1, Scenario 2.1, Scenario 2.3, Scenario 2.4, Scenario 2.5,  Scenario 2.6                             |
| Variants         |                                                                Scenario 2.7                                                                |
| Exceptions       | Scenario 2.8(username already exixting), Scenario 2.9(Inexistent email), Scenario 2.10(mail already used), Scenario 2.11(invalid password) |

##### Scenario 2.1

| Scenario 2.1   |                                                                   |
|----------------|:-----------------------------------------------------------------:| 
| Precondition   |                       User is authenticated                       |
| Post condition |                       User changed username                       |
| Step#          |                            Description                            |
| 1              |                     User provide new username                     |  
| 2              |           Search for username, username Inexistent, ok            | 
| 3              | Show a message to User saying that the username has been modified |

##### Scenario 2.2

| Scenario 2.2   |                                                               |
|----------------|:-------------------------------------------------------------:| 
| Precondition   |                     User is authenticated                     |
| Post condition |                       User changed name                       |
| Step#          |                          Description                          |
| 1              |                     User provide new name                     |  
| 2              |                       name not null, ok                       | 
| 3              | Show a message to User saying that the name has been modified |

##### Scenario 2.3

| Scenario 2.3   |                                                                  |
|----------------|:----------------------------------------------------------------:| 
| Precondition   |                      User is authenticated                       |
| Post condition |                       User changed surname                       |
| Step#          |                           Description                            |
| 1              |                     User provide new surname                     |  
| 2              |                       surname not null, ok                       | 
| 3              | Show a message to User saying that the surname has been modified |

##### Scenario 2.4

| Scenario 2.4   |                                                                  |
|----------------|:----------------------------------------------------------------:| 
| Precondition   |                    Customer is authenticated                     |
| Post condition |                     Custemer changed address                     |
| Step#          |                           Description                            |
| 1              |                   Customer provide new address                   |  
| 2              |                      address exixsting, ok                       | 
| 3              | Show a message to User saying that the address has been modified |

##### Scenario 2.5

| Scenario 2.5   |                                                                 |
|----------------|:---------------------------------------------------------------:| 
| Precondition   |                      User is authenticated                      |
| Post condition |                       User changed e-mail                       |
| Step#          |                           Description                           |
| 1              |                    User provide new e-amail                     |  
| 2              |               search for email, not existing: ok                | 
| 3              |                 Send verification email to User                 |  
| 4              |                    Request verification code                    |
| 5              |                 User input a verification code                  |
| 6              |                   Check correctness, correct                    |
| 7              | Show a message to User saying that the e-mail has been modified |

##### Scenario 2.6

| Scenario 2.6   |                                                                   |
|----------------|:-----------------------------------------------------------------:| 
| Precondition   |                       User is authenticated                       |
| Post condition |                       User changed password                       |
| Step#          |                            Description                            |
| 1              |                     User provide new password                     |  
| 2              |              validate password with safety rules, ok              | 
| 3              | Show a message to User saying that the password has been modified |

##### Scenario 2.7

| Scenario 2.7   |                                                                  |
|----------------|:----------------------------------------------------------------:| 
| Precondition   |                     Manager is authenticated                     |
| Post condition |                       Manager changed name                       |
| Step#          |                           Description                            |
| 1              |                     Manager provide new name                     |  
| 2              |                        name not null, ok                         | 
| 3              | Show a message to Manager saying that the name has been modified |

##### Scenario 2.8

| Scenario 2.8   |                                              |
|----------------|:--------------------------------------------:| 
| Precondition   |            User is authenticated             |
| Post condition |            username not modified             |
| Step#          |                 Description                  |
| 1              |          User provide new username           |  
| 2              | Search for username, username already exists | 
| 3              |                  Show error                  |

##### Scenario 2.9

| Scenario 2.9   |                                    |
|----------------|:----------------------------------:| 
| Precondition   |       User is authenticated        |
| Post condition |        e-mail not modified         |
| Step#          |            Description             |
| Step#          |            Description             |
| 1              |      User provide new e-amail      |  
| 2              | search for email, not existing: ok | 
| 3              |  Send verification email to User   |  
| 4              |     Request verification code      |
| 5              |   User input a verification code   |
| 6              |   Check correctness, not correct   |
| 7              |            Show error.             |

##### Scenario 2.10

| Scenario 2.10  |                                    |
|----------------|:----------------------------------:| 
| Precondition   |       User is authenticated        |
| Post condition |        e-mail not modified         |
| Step#          |            Description             |
| Step#          |            Description             |
| 1              |      User provide new e-amail      |  
| 2              | search for email, already existing | 
| 3              |            Show error.             |

##### Scenario 2.11

| Scenario 2.11  |                                                          |
|----------------|:--------------------------------------------------------:| 
| Precondition   |                  User is authenticated                   |
| Post condition |                  password not modified                   |
| Step#          |                       Description                        |
| 1              |                User provide new password                 |  
| 2              | validate password with safety rules, rules not satisfied | 
| 3              |                        Show error                        |

### Create new Store, UC3

| Actors Involved  |                     Manager                     |
|------------------|:-----------------------------------------------:| 
| Precondition     | User has an account and is logged in as Manager |
| Post condition   |                                                 |
| Nominal Scenario |                  Scenario 3.1                   |
| Variants         |                                                 |
| Exceptions       |        Scenario 3.2(inexistent address)         |

##### Scenario 3.1

| Scenario 3.1   |                                                                      |
|----------------|:--------------------------------------------------------------------:| 
| Precondition   |           User has an account and is logged in as Manager            |
| Post condition |                         New Store is created                         |
| Step#          |                             Description                              |
| 1              |                Manager inputs Store name and address                 |  
| 2              |               Search for address, find an existing one               | 
| 3              | Show a message to Manager saying that the new store has been Created |

##### Scenario 3.2

| Scenario 3.2   |                                                 |
|----------------|:-----------------------------------------------:| 
| Precondition   | User has an account and is logged in as Manager |
| Post condition |          The new store is not created           |
| Step#          |                   Description                   |
| 1              |      Manager inputs Store name and address      | 
| 2              |                Name not null, ok                | 
| 3              |   Search for address, address doesn't exists    | 
| 4              |                   Show error.                   |

### Change Store informations, UC4

| Actors Involved  |                     Manager                     |
|------------------|:-----------------------------------------------:| 
| Precondition     | User has an account and is logged in as Manager |
| Post condition   |                                                 |
| Nominal Scenario |                  Scenario 4.1                   |
| Variants         |                  Scenario 4.2                   |
| Exceptions       |      Scenario 4.3(inexistent new address)       |

##### Scenario 4.1

| Scenario 4.1   |                                                                    |
|----------------|:------------------------------------------------------------------:| 
| Precondition   |          User has an account and is logged in as Manager           |
| Post condition |                      Store's name is modified                      |
| Step#          |                            Description                             |
| 1              |                Manager inputs the new store's name                 |  
| 2              |                         name not null, ok                          | 
| 3              | Show a message to Manager saying that the  store has been modified |

##### Scenario 4.2

| Scenario 4.2   |                                                                    |
|----------------|:------------------------------------------------------------------:| 
| Precondition   |          User has an account and is logged in as Manager           |
| Post condition |                    Store's address is modified                     |
| Step#          |                            Description                             |
| 1              |               Manager inputs the new store's address               |  
| 2              |              Search for address, find an existing one              | 
| 3              | Show a message to Manager saying that the  store has been modified |

##### Scenario 4.3

| Scenario 4.3   |                                                 |
|----------------|:-----------------------------------------------:| 
| Precondition   | User has an account and is logged in as Manager |
| Post condition |       The store's address is not modified       |
| Step#          |                   Description                   |
| 1              |       Manager inputs new store's address        |  
| 2              |   Search for address, address doesn't exists    | 
| 3              |                   Show error.                   |

### Delete Store, UC5

| Actors Involved  |                     Manager                     |
|------------------|:-----------------------------------------------:| 
| Precondition     | User has an account and is logged in as Manager |
| Post condition   |                        -                        |
| Nominal Scenario |                  Scenario 5.1                   |
| Variants         |                        -                        |
| Exceptions       |                        -                        |

##### Scenario 5.1

| Scenario 5.1   |                                                    |
|----------------|:--------------------------------------------------:| 
| Precondition   |  User has an account and is logged in as Manager   |
| Post condition |                  Store is deleted                  |
| Step#          |                    Description                     |
| 1              |         Manager request to delete a store          |  
| 2              | the system retrives all the products of that store | 
| 3              |    Each product of the store is deleted - F2.6     |

### Create Product , UC5

| Actors Involved  |                                                                          Manager                                                                          |
|:----------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------:|
|   Precondition   |                                                                 user logged in as manager                                                                 |
|  Post condition  |                                                                             -                                                                             |
| Nominal Scenario |                                                                       Scenario 5.1                                                                        |
|     Variants     |                                                                       Scenario 5.2                                                                        |
|    Exceptions    | Scenario 5.3(product's code alreasy exists), Scenario 5.4(inexistent store/manager does't possess store), Scenario 5.5 (Arrival date asfter current date) |

##### Scenario 5.1

|  Scenario 5.1  |                                                                                                    |
|:--------------:|:--------------------------------------------------------------------------------------------------:|
|  Precondition  |                                     user logged in as Manager                                      | 
| Post condition |                                          Product created                                           |
|     Step#      |                                            Description                                             |
|       1        | User inserts product info: code, sellingPrice, model, category, details, arrivalDate, store's code |
|       2        |                            system checks code, does not already exists                             |
|       3        |                       system checks arrival date, exists and is current date                       |
|       4        |             system checks code's store is associated to current manager and exist ,ok              |
|       5        |                                   system validates other fields                                    |
|       6        |                                 product added, return product code                                 |

##### Scenario 5.2

|  Scenario 5.2  |                                                                                        |
|:--------------:|:--------------------------------------------------------------------------------------:|
|  Precondition  |                               user logged in as Manager                                |
| Post condition |                                    Product created                                     |
|     Step#      |                                      Description                                       |
|       1        | User inserts product info: code, sellingPrice, model, category, details,  store's code |
|       2        |                      system checks code, does not already exists                       |
|       3        |                       system checks arrival date, does not exist                       |
|       4        |                        system sets arrival date to current date                        |
|       5        |       system checks code's store is associated to current manager and exist ,ok        |
|       6        |              system validates other fields, they comply with constraints               |
|       7        |                           product added, return product code                           |

##### Scenario 5.3

|  Scenario 5.3  |                                                                                                    |
|:--------------:|:--------------------------------------------------------------------------------------------------:|
|  Precondition  |                                     user logged in as Manager                                      | 
| Post condition |                                        Product not created                                         |
|     Step#      |                                            Description                                             |
|       1        | User inserts product info: code, sellingPrice, model, category, details, arrivalDate, store's code |
|       2        |                                 system checks code, already exists                                 |
|       3        |                                             Show error                                             |

##### Scenario 5.4

|  Scenario 5.4  |                                                                                                    |
|:--------------:|:--------------------------------------------------------------------------------------------------:|
|  Precondition  |                                     user logged in as Manager                                      | 
| Post condition |                                        Product not created                                         |
|     Step#      |                                            Description                                             |
|       1        | User inserts product info: code, sellingPrice, model, category, details, arrivalDate, store's code |
|       2        |                            system checks code, does not already exists                             |
|       3        |                       system checks arrival date, exists and is current date                       |
|       4        |           system checks code's store is associated to current manager and exist , not ok           |
|       5        |                                             show error                                             |

##### Scenario 5.5

|  Scenario 5.5  |                                                                                                    |
|:--------------:|:--------------------------------------------------------------------------------------------------:|
|  Precondition  |                                     user logged in as Manager                                      |
| Post condition |                                        Product not created                                         |
|     Step#      |                                            Description                                             |
|       1        | User inserts product info: code, sellingPrice, model, category, details, arrivalDate, store's code |
|       2        |                            system checks code, does not already exists                             |
|       3        |                         system checks arrival date, is after current date                          |
|       4        |                  system shows error describing that the arrivalDate is incorrect                   |

### Register arrivals , UC6

| Actors Involved  |                                                   Manager                                                   |
|:----------------:|:-----------------------------------------------------------------------------------------------------------:|
|   Precondition   |                                          user logged in as manager                                          |
|  Post condition  |                                                                                                             |
| Nominal Scenario |                                                Scenario 6.1                                                 |
|     Variants     |                                                Scenario 6.2                                                 |
|    Exceptions    | Scenario 6.3(Arrival date asfter current date), Scenario 6.4(inexistent store/manager does't possess store) |

##### Scenario 6.1

|  Scenario 6.1  |                                                                                                                                 |
|:--------------:|:-------------------------------------------------------------------------------------------------------------------------------:|
|  Precondition  |                                                    user logged in as manager                                                    |
| Post condition |                                                       arrivals registered                                                       |
|     Step#      |                                                           Description                                                           |
|       1        | User inserts arrival product info: model, category, sellingPrice, model, category, details, arrivalDate, quantity, store's code |
|       2        |                                   system checks arrival date exists and is current date , ok                                    |
|       3        |                           system checks code's store is associated to current manager and exist,  ok                            |
|       4        |                                   system validates other fields, they comply with constraints                                   |
|       5        |                                                       arrival registered                                                        |

##### Scenario 6.2

|  Scenario 6.2  |                                                                                                                    |
|:--------------:|:------------------------------------------------------------------------------------------------------------------:|
|  Precondition  |                                             user logged in as manager                                              |
| Post condition |                                                arrivals registered                                                 |
|     Step#      |                                                    Description                                                     |
|       1        | User inserts arrival product info: model, category, sellingPrice, model, category, details, quantity, store's code |
|       2        |                                     system checks arrival date, does not exist                                     |
|       3        |                                      system sets arrival date to current date                                      |
|       4        |                     system checks code's store is associated to current manager and exist,  ok                     |
|       5        |                            system validates other fields, they comply with constraints                             |
|       6        |                                                 arrival registered                                                 |

##### Scenario 6.3

|  Scenario 6.3  |                                                                                                                                 |
|:--------------:|:-------------------------------------------------------------------------------------------------------------------------------:|
|  Precondition  |                                                    user logged in as manager                                                    |
| Post condition |                                                     arrivals not registered                                                     |
|     Step#      |                                                           Description                                                           |
|       1        | User inserts arrival product info: model, category, sellingPrice, model, category, details, arrivalDate, quantity, store's code |
|       2        |                                  system checks arrival date, exists and is after current date                                   |
|       3        |                                 system shows error describing that the arrivalDate is incorrect                                 |

##### Scenario 6.4

|  Scenario 6.4  |                                                                                                                                 |
|:--------------:|:-------------------------------------------------------------------------------------------------------------------------------:|
|  Precondition  |                                                    user logged in as manager                                                    |
| Post condition |                                                     arrivals not registered                                                     |
|     Step#      |                                                           Description                                                           |
|       1        | User inserts arrival product info: model, category, sellingPrice, model, category, details, arrivalDate, quantity, store's code |
|       2        |                                   system checks arrival date exists and is current date , ok                                    |
|       3        |                         system checks code's store is associated to current manager and exist,  not ok                          |
|       4        |                                                           Show error                                                            |

### Approve transaction, UC7

| Actors Involved  |          Manager           |
|:----------------:|:--------------------------:|
|   Precondition   | user logged in as manager  |
|  Post condition  |                            |
| Nominal Scenario |        Scenario 7.1        |
|     Variants     |                            |
|    Exceptions    | Scenario 7.2, Scenario 7.3 |

##### Scenario 7.1

|  Scenario 7.1  |                                                                                   |
|:--------------:|:---------------------------------------------------------------------------------:|
|  Precondition  |                             user logged in as manager                             |
| Post condition |                            product marked as approved                             |
|     Step#      |                                    Description                                    |
|       1        |                     Manager attempts to approve a transaction                     |
|       2        |                   system checks if the product exists , it does                   |
|       3        |    system checks if the sold field of the product results as not sold, it does    |
|       4        | system checks if the requestes field of the product results as requested, it does |
|       5        |                approved field of the product is marked as approved                |

##### Scenario 7.2

|  Scenario 7.2  |                                                                                |
|:--------------:|:------------------------------------------------------------------------------:|
|  Precondition  |                           user logged in as manager                            |
| Post condition |                           product marked as approved                           |
|     Step#      |                                  Description                                   |
|       1        |                   Manager attempts to approve a transaction                    |
|       2        |                 system checks if the product exists , it does                  |
|       3        | system checks if the sold field of the product results as not sold, it doesn't |
|       4        |                                   show error                                   |

##### Scenario 7.3

|  Scenario 7.3  |                                                                                       |
|:--------------:|:-------------------------------------------------------------------------------------:|
|  Precondition  |                               user logged in as manager                               |
| Post condition |                              product marked as approved                               |
|     Step#      |                                      Description                                      |
|       1        |                       Manager attempts to approve a transaction                       |
|       2        |                     system checks if the product exists , it does                     |
|       3        |      system checks if the sold field of the product results as not sold, it does      |
|       4        | system checks if the requestes field of the product results as requested, it does not |
|       5        |                                      show error                                       |

### Get product info by code, UC8

| Actors Involved  |                Visitor                |
|:----------------:|:-------------------------------------:|
|   Precondition   |                                       |
|  Post condition  |                                       |
| Nominal Scenario |             Scenario 8.1              |
|     Variants     |      Scenario 8.2 , Scenario 8.3      |
|    Exceptions    | Scenario 8.4 (product does not exist) |

##### Scenario 8.1

|  Scenario 8.1  |                                                  |
|:--------------:|:------------------------------------------------:|
|  Precondition  |                                                  |
| Post condition |                 get product info                 |
|     Step#      |                   Description                    |
|       1        |           Visitor inputs product code            |
|       2        |  system searches for product by code, it exists  |
|       3        | system finds product and returns product details |

##### Scenario 8.2

|  Scenario 8.2  |                                                  |
|:--------------:|:------------------------------------------------:|
|  Precondition  |            user logged in as Customer            |
| Post condition |                 get product info                 |
|     Step#      |                   Description                    |
|       1        |           Customer inputs product code           |
|       2        |  system searches for product by code, it exists  |
|       3        | system finds product and returns product details |

##### Scenario 8.3

|  Scenario 8.3  |                                                  |
|:--------------:|:------------------------------------------------:|
|  Precondition  |            user logged in as Manager             |
| Post condition |                 get product info                 |
|     Step#      |                   Description                    |
|       1        |           Manager inputs product code            |
|       2        | system searches for product by code , it exists  |
|       3        | system finds product and returns product details |

##### Scenario 8.4

|  Scenario 8.4  |                                                     |
|:--------------:|:---------------------------------------------------:|
|  Precondition  |                                                     |
| Post condition |                  get product info                   |
|     Step#      |                     Description                     |
|       1        |             Visitor inputs product code             |
|       2        | system searches for product by code, doesn't exists |
|       3        |                     show error                      |

### List Products, UC9

| Actors Involved  |                          User                          |
|:----------------:|:------------------------------------------------------:|
|   Precondition   |                                                        |
|  Post condition  |                                                        |
| Nominal Scenario |                      Scenario 9.1                      |
|     Variants     | Scenario 9.2, Scenario 9.3, Scenario 9.4, Scenario 9.5 |
|    Exceptions    |                           -                            |

##### Scenario 9.1

|  Scenario 9.1  |                                      |
|:--------------:|:------------------------------------:|
|  Precondition  |                                      |
| Post condition |          get products info           |
|     Step#      |             Description              |
|       1        | Visitor requests to see all products |
|       2        | system returns all products (if any) |

##### Scenario 9.2

|  Scenario 9.2  |                                                            |
|:--------------:|:----------------------------------------------------------:|
|  Precondition  |                                                            |
| Post condition |                        get products                        |
|     Step#      |                        Description                         |
|       1        | Visitor requests to see all products in a certain category |
|       2        |   system returns all products in that category  (if any)   |

##### Scenario 9.3

|  Scenario 9.3  |                                                         |
|:--------------:|:-------------------------------------------------------:|
|  Precondition  |                                                         |
| Post condition |                      get products                       |
|     Step#      |                       Description                       |
|       1        | Visitor requests to see all products of a certain model |
|       2        |    system returns all products of that model(if any)    |

##### Scenario 9.4

|  Scenario 9.4  |                                                                            |
|:--------------:|:--------------------------------------------------------------------------:|
|  Precondition  |                                                                            |
| Post condition |                                get products                                |
|     Step#      |                                Description                                 |
|       1        | Visitor requests to see all products in a certain category and sold status |
|       2        |  system returns all products in that category and sold status   (if any)   |

##### Scenario 9.5

|  Scenario 9.5  |                                                                         |
|:--------------:|:-----------------------------------------------------------------------:|
|  Precondition  |                                                                         |
| Post condition |                              get products                               |
|     Step#      |                               Description                               |
|       1        | Visitor requests to see all products of a certain model and sold status |
|       2        |   system returns all products of that model and sold status (if any)    |

##### Scenario 9.6

|  Scenario 9.6  |                                       |
|:--------------:|:-------------------------------------:|
|  Precondition  |      User logged in as Customer       |
| Post condition |           get products info           |
|     Step#      |              Description              |
|       1        | Customer requests to see all products |
|       2        | system returns all products (if any)  |

##### Scenario 9.7

|  Scenario 9.7  |                                                                         |
|:--------------:|:-----------------------------------------------------------------------:|
|  Precondition  |                        User logged in as Manager                        |
| Post condition |                            get products info                            |
|     Step#      |                               Description                               |
|       1        | Manager requests to see all products of a certain model and sold status |
|       2        |   system returns all products of that model and sold status (if any)    |

### Delete Product, UC10

| Actors Involved  |          Manager          |
|:----------------:|:-------------------------:|
|   Precondition   | user logged in as manager |
|  Post condition  |                           |
| Nominal Scenario |       Scenario 10.1       |
|     Variants     |             -             |
|    Exceptions    |       Scenario 10.2       |

##### Scenario 10.1

| Scenario 10.1  |                                           |
|:--------------:|:-----------------------------------------:|
|  Precondition  |         user logged in as manager         |
| Post condition |            product is deleted             |
|     Step#      |                Description                |
|       1        | Manager inputs product code to be deleted |
|       2        |    system searches for product by code    |
|       3        |    system finds product and deletes it    |

##### Scenario 10.2

| Scenario 10.2  |                                           |
|:--------------:|:-----------------------------------------:|
|  Precondition  |         user logged in as manager         |
| Post condition |          product is not deleted           |
|     Step#      |                Description                |
|       1        | Manager inputs product code to be deleted |
|       2        |    system searches for product by code    |
|       3        |       system does not find product        |
|       4        |       system returns error message        |

### Get cart, UC11

| Actors Involved  |          Customer          |
|:----------------:|:--------------------------:|
|   Precondition   | user logged in as customer |
|  Post condition  |                            |
| Nominal Scenario |       Scenario 11.1        |
|     Variants     |             -              |
|    Exceptions    |             -              |

##### Scenario 11.1

| Scenario 11.1  |                                         |
|:--------------:|:---------------------------------------:|
|  Precondition  |       user logged in as customer        |
| Post condition |          cart info is returned          |
|     Step#      |               Description               |
|       1        | User requests to see their current cart |
|       2        |        system returns cart info         |

### Add product to cart, UC12

| Actors Involved  |                  Customer                  |
|:----------------:|:------------------------------------------:|
|   Precondition   | user logged in as customer, product exists |
|  Post condition  |                                            |
| Nominal Scenario |               Scenario 12.1                |
|     Variants     |                     -                      |
|    Exceptions    |        Scenario 12.2, Scenario 12.3        |

##### Scenario 12.1

| Scenario 12.1  |                                                        |
|:--------------:|:------------------------------------------------------:|
|  Precondition  |       user logged in as customer,product exists        |
| Post condition |         product is added to the customer cart          |
|     Step#      |                      Description                       |
|       1        |      User inputs product code to be added to cart      |
|       2        |          system searches for product by code           |
|       3        | system checks if product is in another cart, it is not |
|       4        |      system checks if product is sold, it is not       |
|       5        |         product is added to the customer cart          |

##### Scenario 12.2

| Scenario 12.2  |                                                                  |
|:--------------:|:----------------------------------------------------------------:|
|  Precondition  |            user logged in as customer,product exists             |
| Post condition |              product is not added to customer cart               |
|     Step#      |                           Description                            |
|       1        |           User inputs product code to be added to cart           |
|       2        |       system searches for product by code, product exists        |
|       3        |        system checks if product is in another cart, it is        |
|       4        | system returns error message that the product is in another cart |
|       5        |            product is not added to the customer cart             |

##### Scenario 12.3

| Scenario 12.3  |                                                               |
|:--------------:|:-------------------------------------------------------------:|
|  Precondition  |           user logged in as customer,product exists           |
| Post condition |             product is not added to customer cart             |
|     Step#      |                          Description                          |
|       1        |         User inputs product code to be added to cart          |
|       2        |      system searches for product by code, product exists      |
|       4        |    system checks if product is in another cart, it is not     |
|       5        |            system checks if product is sold, it is            |
|       6        | system returns error message that the product is already sold |
|       7        |           product is not added to the customer cart           |

### Delete product from cart, UC13

| Actors Involved  |                  Customer                  |
|:----------------:|:------------------------------------------:|
|   Precondition   | user logged in as customer, product exixts |
|  Post condition  |                                            |
| Nominal Scenario |               Scenario 13.1                |
|     Variants     |                                            |
|    Exceptions    |               Scenario 13.2                |

##### Scenario 13.1

| Scenario 13.1  |                                                                               |
|:--------------:|:-----------------------------------------------------------------------------:|
|  Precondition  |                          user logged in as customer                           |
| Post condition |                     product is deleted from customer cart                     |
|     Step#      |                                  Description                                  |
|       1        | Customer inputs an existing product code to be deleted from the customer cart |
|       2        |          system checks that the product exists in the cart, it does           |
|       3        |                   product is deleted from the customer cart                   |

##### Scenario 13.2

| Scenario 13.2  |                                                                               |
|:--------------:|:-----------------------------------------------------------------------------:|
|  Precondition  |                          user logged in as customer                           |
| Post condition |                   no product is deleted from customer cart                    |
|     Step#      |                                  Description                                  |
|       1        | Customer inputs an existing product code to be deleted from the customer cart |
|       2        |         system checks that the product exists in the cart, it doesn't         |
|       3        |                   show error, product not deleted from cart                   |

### Request cart, UC14

| Actors Involved  |          Customer          |
|:----------------:|:--------------------------:|
|   Precondition   | user logged in as customer |
|  Post condition  |                            |
| Nominal Scenario |       Scenario 14.1        |
|     Variants     |             -              |
|    Exceptions    |       Scenario 14.2        |

##### Scenario 14.1

| Scenario 14.1  |                                                               |
|:--------------:|:-------------------------------------------------------------:|
|  Precondition  |                  user logged in as customer                   |
| Post condition |                       cart is requested                       |
|     Step#      |                          Description                          |
|       1        |   User requests to pay for the products in the current cart   |
|       2        |         system checks if the cart is empty, it is not         |
|       3        | system sets total as sum of all costs of products in the cart |
|       4        |    system sets requested field of the product as requested    |

##### Scenario 14.2

| Scenario 14.2  |                                                           |
|:--------------:|:---------------------------------------------------------:|
|  Precondition  |                user logged in as customer                 |
| Post condition |                   cart is not paid for                    |
|     Step#      |                        Description                        |
|       1        | User requests to pay for the products in the current cart |
|       3        |      system checks if the cart is empty, it is empty      |
|       4        |    system returns error message that the cart is empty    |
|       5        |                   cart is not requested                   |

### Get customer cart history, UC15

| Actors Involved  |          Customer          |
|:----------------:|:--------------------------:|
|   Precondition   | user logged in as customer |
|  Post condition  |                            |
| Nominal Scenario |       Scenario 15.1        |
|     Variants     |             -              |
|    Exceptions    |             -              |

##### Scenario 15.1

| Scenario 15.1  |                                         |
|:--------------:|:---------------------------------------:|
|  Precondition  |       user logged in as  customer       |
| Post condition |     customer cart history returned      |
|     Step#      |               Description               |
|       1        | User requests to see their cart history |
|       2        |  system returns customer cart history   |

### Delete current customer cart, UC16

| Actors Involved  |          Customer          |
|:----------------:|:--------------------------:|
|   Precondition   | user logged in as customer |
|  Post condition  |                            |
| Nominal Scenario |       Scenario 16.1        |
|     Variants     |       Scenario 16.2        |
|    Exceptions    |             -              |

##### Scenario 16.1

| Scenario 16.1  |                                            |
|:--------------:|:------------------------------------------:|
|  Precondition  |     user logged in as premium customer     |
| Post condition |          customer cart is deleted          |
|     Step#      |                Description                 |
|       1        | User requests to delete their current cart |
|       2        |      system deletes the customer cart      |

##### Scenario 16.2

| Scenario 16.2  |                                            |
|:--------------:|:------------------------------------------:|
|  Precondition  |      user logged in as free customer       |
| Post condition |        customer cart is not deleted        |
|     Step#      |                Description                 |
|       1        | User requests to delete their current cart |
|       2        |            customer watch adds             |
|       3        |      system deletes the customer cart      |

### Payment of the cart, UC17

| Actors Involved  |                             Customer, Manager                              |
|:----------------:|:--------------------------------------------------------------------------:|
|   Precondition   | user logged in as customer, each product of his cart is marked as approved |
|  Post condition  |                                                                            |
| Nominal Scenario |                               Scenario 17.1                                |
|     Variants     |                                     -                                      |
|    Exceptions    |                        Scenario 17.2, Scenario 17.3                        |

##### Scenario 17.1

| Scenario 17.1  |                                                                            |
|:--------------:|:--------------------------------------------------------------------------:|
|  Precondition  | user logged in as customer, each product of his cart is marked as approved |
| Post condition |                                cart is sold                                |
|     Step#      |                                Description                                 |
|       1        |         User requests to pay for the products in the current cart          |
|       2        |               system checks if the cart is empty, it is not                |
|       3        |           system checks if the user has enough money to pay, ok            |
|       4        |      system Remunerate the manager while mantaining a commission F...      |

##### Scenario 17.2

| Scenario 17.2  |                                                                            |
|:--------------:|:--------------------------------------------------------------------------:|
|  Precondition  | user logged in as customer, each product of his cart is marked as approved |
| Post condition |                              cart is not sold                              |
|     Step#      |                                Description                                 |
|       1        |         User requests to pay for the products in the current cart          |
|       2        |                 system checks if the cart is empty, it is                  |
|       3        |                    show error, don't allow transaction                     |

##### Scenario 17.3

| Scenario 17.3  |                                                                            |
|:--------------:|:--------------------------------------------------------------------------:|
|  Precondition  | user logged in as customer, each product of his cart is marked as approved |
| Post condition |                                cart is sold                                |
|     Step#      |                                Description                                 |
|       1        |         User requests to pay for the products in the current cart          |
|       2        |               system checks if the cart is empty, it is not                |
|       3        |       system checks if the user has enough money to pay, he has not        |
|       4        |                    show error, don't allow transaction                     |

# Glossary

\<use UML class diagram to define important terms, or concepts in the domain of the application, and their
relationships>

\<concepts must be used consistently all over the document, ex in use cases, requirements etc>

# Deployment Diagram

\<describe here deployment diagram >
