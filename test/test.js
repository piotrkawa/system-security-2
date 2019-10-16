const chai = require('chai');
const chaiHttp = require('chai-http');
const axios = require('axios');
var assert = require('assert');
const mcl = require('mcl-wasm');

const mclService = require('../src/services/mclService');
const app = require('../app');
const CONFIG = require('../config').CONFIG;

mcl.init(CONFIG.CURVE_TYPE);

// Configure chai
chai.use(chaiHttp);
chai.should();


function initializeValuesForInit() {
    
    const g = mclService.getGroupGenerator();
    const a = mclService.getRandomScalar();
    const x = mclService.getRandomScalar();

    const A = mcl.mul(g, a);
    const X = mcl.mul(g, x);
    
    const body = {
        protocol_name: 'sis',
        payload: {
            A: A.getStr(10).slice(2),
            X: X.getStr(10).slice(2)
        }
    };
    return {a, x, body};
}

describe("SIS", () => {
    describe("", () => {
        it("should pass the verification", async function (done) {
            let {a, x, body} = initializeValuesForInit();
            let response = await chai.request(app)
                                       .post('/protocols/sis/init')
                                       .send(body);
            const sessionToken = response.body.session_token;
            const c = new mcl.Fr();
            c.setStr(response.body.payload.c);

            const ac = mcl.mul(a, c);
            const s = mcl.add(ac, x);    
            
            body = {
                protocol_name: 'sis',
                session_token: sessionToken,
                payload: {
                    's': s.getStr(10)
                }
            };

            response = await chai.request(app)
                                       .post('/protocols/sis/verify')
                                       .send(body);
            assert(response.body.verified)
            done();
        });
        
        it("should not pass the verification", (done) => {
            done();
        });

        // // Test to get single student record
        // it("should get a single student record", (done) => {
        //      const id = 1;
        //      chai.request(app)
        //          .get(`/${id}`)
        //          .end((err, res) => {
        //              res.should.have.status(200);
        //              res.body.should.be.a('object');
        //              done();
        //           });
        //  });
         
        // // Test to get single student record
        // it("should not get a single student record", (done) => {
        //      const id = 5;
        //      chai.request(app)
        //          .get(`/${id}`)
        //          .end((err, res) => {
        //              res.should.have.status(404);
        //              done();
        //           });
        //  });
    });
});


// ROOT = 'http://127.0.0.1:3000'


async function testSISValidData() { 
    
    const g = mclService.getGroupGenerator();
    const a = mclService.getRandomScalar();
    const x = mclService.getRandomScalar();

    const A = mcl.mul(g, a);
    const X = mcl.mul(g, x);

    let body = {
        protocol_name: 'sis',
        payload: {
            A: A.getStr(10).slice(2),
            X: X.getStr(10).slice(2)
        }
    };

    let responseData;
    await axios.post(ROOT + '/protocols/sis/init', body)
        .then(function (response) {
            responseData = response.data;
        });

    const session_token = responseData.session_token; 
    const c = new mcl.Fr();
    c.setStr(responseData.payload.c);

    const ac = mcl.mul(a, c);
    const s = mcl.add(ac, x);    
    
    body = {
        protocol_name: 'sis',
        session_token: session_token,
        payload: {
            's': s.getStr(10)
        }
    };
    resp = await axios.post(ROOT + '/protocols/sis/verify', body);
    assert(resp.data.verified)
}

// testSISValidData()
