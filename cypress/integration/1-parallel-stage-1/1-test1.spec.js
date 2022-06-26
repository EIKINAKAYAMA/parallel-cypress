/// <reference types="cypress" />

describe('parallel-stage-1', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })

  it('parallel-stage-1-test1', () => {
    cy.contains('Learn React');
  })
})
