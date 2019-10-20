const chai = require('chai');
const chaiHttp = require('chai-http');
var assert = require('assert');
const mcl = require('mcl-wasm');

const mclService = require('../src/services/mclService');
const sisService = require('../src/services/sisService');
const oisService = require('../src/services/oisService');
const CONFIG = require('../config').CONFIG;
const app = require('../app');


mcl.init(CONFIG.CURVE_TYPE);
chai.use(chaiHttp);
chai.should();


before(function (done) {
    app.on("app_started", function(){
        done();
    });
    done();
});


describe("SIS", () => {
    describe("", () => {
        it("should pass the verification", async function () {
            const g = sisService.getGroupGenerator();
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
        });
    });
});


describe("OIS", () => {
    describe("", () => {
        it("should pass the verification", async function () {

            const { g1, g2 } = oisService.getGroupGenerators();
            const a1 = mclService.getRandomScalar();
            const a2 = mclService.getRandomScalar();
            const A1 = mcl.mul(g1, a1);
            const A2 = mcl.mul(g2, a2);
            const A = mcl.add(A1, A2)

            const x1 = mclService.getRandomScalar();
            const x2 = mclService.getRandomScalar();
            const X1 = mcl.mul(g1, x1);
            const X2 = mcl.mul(g2, x2);
            const X = mcl.add(X1, X2);

            let body = {
                protocol_name: 'ois',
                payload: {
                    A: A.getStr(10).slice(2),
                    X: X.getStr(10).slice(2)
                }
            };
            let response = await chai.request(app)
                                       .post('/protocols/ois/init')
                                       .send(body);

            responseData = response.body;
            const session_token = responseData.session_token; 
            const c = new mcl.Fr();
            c.setStr(responseData.payload.c);

            const ac1 = mcl.mul(a1, c);
            let s1 = mcl.add(ac1, x1);

            const ac2 = mcl.mul(a2, c);
            let s2 = mcl.add(ac2, x2);

            body = {
                protocol_name: 'ois',
                session_token: session_token,
                payload: {
                    's1': s1.getStr(10),
                    's2': s2.getStr(10)
                }
            };

            response = await chai.request(app)
                                       .post('/protocols/ois/verify')
                                       .send(body);
            assert(response.body.verified)
        });
    });
});
