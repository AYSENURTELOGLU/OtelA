

describe('Trello Board and Card Management', () => {
    const apiKey = 'ed43bce596780cc34721f18aa4e67a42';
    const apiToken = 'ATTA2f98b539a2f95420a96efd6b7258d1acaecff1c14dcefc60cfaee2701fea55ddFD7610C2';
    let boardId;//board id for update delete
    let listId; // for random update
    let cardIds = [];
  
    it('creates a new Trello board', () => {
      cy.request({
        method: 'POST',
        url: `https://api.trello.com/1/boards/?name=My New Board&key=${apiKey}&token=${apiToken}`
      }).then((response) => {
        expect(response.status).to.eq(200);
        boardId = response.body.id;
        cy.log('Board created with ID:', boardId);
      });
    });
  
    it('creates a new list in the board', () => {
      cy.request({
        method: 'POST',
        url: `https://api.trello.com/1/lists?name=To-Do&idBoard=${boardId}&key=${apiKey}&token=${apiToken}`
      }).then((response) => {
        expect(response.status).to.eq(200);
        listId = response.body.id;
        cy.log('List created with ID:', listId);
      });
    });
  
    it('creates the first card in the new board', () => {
      cy.request({
        method: 'POST',
        url: `https://api.trello.com/1/cards?idList=${listId}&name=First Card&key=${apiKey}&token=${apiToken}`
      }).then((response) => {
        expect(response.status).to.eq(200);
        cardIds.push(response.body.id);
        cy.log('First card created with ID:', response.body.id);
      });
      cy.request({
        method: 'POST',
        url: `https://api.trello.com/1/cards?idList=${listId}&name=Second Card&key=${apiKey}&token=${apiToken}`
      }).then((response) => {
        expect(response.status).to.eq(200);
        cardIds.push(response.body.id);
        cy.log('Second card created with ID:', response.body.id);
      });
    });
  
    it('updates a random card in the new board', () => {
      const randomCardId = cardIds[Math.floor(Math.random() * cardIds.length)];
      cy.log('Random card to update with ID:', randomCardId);
  
      cy.request({
        method: 'PUT',
        url: `https://api.trello.com/1/cards/${randomCardId}?name=Updated Card&desc=This is an updated card description&key=${apiKey}&token=${apiToken}`
      }).then((response) => {
        expect(response.status).to.eq(200);
        cy.log('Card updated with ID:', response.body.id);
      });
    });
  
    it('deletes all cards in the new board', () => {
      cardIds.forEach((cardId) => {
        cy.request({
          method: 'DELETE',
          url: `https://api.trello.com/1/cards/${cardId}?key=${apiKey}&token=${apiToken}`
        }).then((response) => {
          expect(response.status).to.eq(200);
          cy.log('Card deleted with ID:', cardId);
        });
      });
    });
  
    it('deletes the created board', () => {
      cy.request({
        method: 'DELETE',
        url: `https://api.trello.com/1/boards/${boardId}?key=${apiKey}&token=${apiToken}`
      }).then((response) => {
        expect(response.status).to.eq(200);
        cy.log('Board deleted with ID:', boardId);
      });
    });
  });