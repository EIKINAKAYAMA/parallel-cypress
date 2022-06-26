/// <reference types="cypress" />

describe('parallel-stage-2', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })

  it('parallel-stage-2-test1', () => {
    cy.contains('Learn React');
  })
})
