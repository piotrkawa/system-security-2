# System Security II

The following repository contains the schemes implemented using during System Security II laborathories during Winter 2019/2020 semester - [link](https://cs.pwr.edu.pl/krzywiecki/teaching.html) (tab Sys. Sec. II).


## Overview
The project is a Node.js (express.js) server that performs cryptographic schemes.


## Implemented Schemes
Computations were performed using elliptic curves (`BLS12_381`).

### Identification Schemes:
* Schnorr Identification Scheme
* Modified Schnorr Identification Scheme
* Okamoto Identification Scheme

### Signature Schemes:
* Schnorr Signature Scheme
* Goh Jarecki Signature Scheme
* Boneh-Lynn-Shacham Signature Scheme


### Authenticated Key Exchange Schemes:
* SIGMA Scheme
* NAXOS Scheme


## Communication modes

The communication with server can be performed in four ways, using:
* HTTP,
* HTTPS,
* Salsa encryption,
* ChaCha20 encryption.


## Tests
One of the main parts of the course was to perform and validate schemes among the students.
Project contains tests validating correctness of the implemented schemes - to run them use `manualTest.js` and specify the address of the second party (to run them locally use `localhost` as a `PERSON`).


## TODO
* move to `Jest`

