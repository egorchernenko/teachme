const expect = require('expect');
const request = require('supertest');

const app = require('./../server');
const Todo = require('./../models/todo');
const User = require('./../models/user');

beforeEach(function (done) {
    Todo.remove({}).then(function () {
        done();
    })
})

describe('POST /todos', function () {
    it('should create new todo', function (done) {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send(text)
            .expect(200)
            .expect(function (res) {
                expect(res.body.text).toBe(text);
            })
            .end(function (err,res) {
                if (err) {
                    return done(err);
                }

                Todo.find().then(function (todos) {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch(function (reason) {
                    done(reason);
                })
            })
    });
});