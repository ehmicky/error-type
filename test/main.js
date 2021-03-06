import test from 'ava'
import errorType from 'error-type'
import { each } from 'test-each'

const { propertyIsEnumerable: isEnum } = Object.prototype

const TestError = errorType('TestError')
const testError = new TestError('test')

test('Has right error type', (t) => {
  t.not(Object.getPrototypeOf(testError), Error.prototype)
  t.true(testError instanceof TestError)
  t.true(testError instanceof Error)
})

// eslint-disable-next-line unicorn/no-null
each([null, 'test'], ({ title }, params) => {
  test(`Validate against invalid instance params | ${title}`, (t) => {
    // eslint-disable-next-line max-nested-callbacks
    t.throws(() => new TestError('test', params))
  })
})

test('Sets error.message', (t) => {
  t.is(testError.message, 'test')
})

test('error.message is not enumerable', (t) => {
  t.false(isEnum.call(testError, 'message'))
})

test('Sets error.stack', (t) => {
  t.true(testError.stack.includes('test'))
})

test('error.stack is not enumerable', (t) => {
  t.false(isEnum.call(testError, 'stack'))
})

const isStackLine = function (line) {
  return line.trim().startsWith('at ')
}

test('error.stack does not include the constructor', (t) => {
  const lines = testError.stack.split('\n')
  const stackIndex = lines.findIndex(isStackLine)
  t.true(lines[stackIndex].includes('main.js'))
})

test('Sets error.cause', (t) => {
  t.is(new TestError('test', { cause: 'test' }).cause, 'test')
})

test('error.cause is not enumerable', (t) => {
  t.false(isEnum.call(new TestError('test', { cause: 'test' }), 'cause'))
})

test('Does not set error.cause by default', (t) => {
  t.false('cause' in new TestError('test'))
})

test('Can set undefined error.cause', (t) => {
  const error = new TestError('test', { cause: undefined })
  t.true('cause' in error)
  t.is(error.cause, undefined)
})

test('Does not set error.errors by default', (t) => {
  t.false('errors' in testError)
})
