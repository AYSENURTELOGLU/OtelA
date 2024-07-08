

describe('OtelZ StudyCase', () => {

    //TestApp Hotel Rezervasyonu Testi

    //"https://www.otelz.com/" adresine gidilir ve açıldığı doğrulanır
    it('Otel rezervasyon işlemlerini gerçekleştirir', () => {
        cy.visit("https://www.otelz.com/");
        cy.url().should('include', 'otelz.com');
 
    //Arama kutusuna "İstanbul" yazılır ve doğrulama yapıldıktan sonra silinir
    cy.get('[data-testid="locationSearchBtn"]').type('İstanbul');
    cy.get('[data-testid="locationSearchBtn"]').should('have.value', 'İstanbul');
    cy.get('[data-testid="locationSearchBtn"]').clear();
    
    //Arama kutusuna "Tuzluca" yazılır
    cy.get('[data-testid="locationSearchBtn"]').type('Tuzluca'); //enter komut calismadi.
    cy.get('#loc-0').click();

    //Tarih kutusu açılır ve gidiş, dönüş için 2 gün ileri tarih seçilir. 
    cy.get('.sc-a26d6d0-0 > .type_0').click();
    cy.get(':nth-child(4) > .react-datepicker__month > :nth-child(2) > .react-datepicker__day--009').click();
    cy.get(':nth-child(4) > .react-datepicker__month > :nth-child(2) > .react-datepicker__day--011').click();
   
    //Arama seçeneklerinde kişi sayısı 1 kişi ve 1 çocuk eklemesi yapılarak 
    //çocuk yaşı 5 olarak secilir ve arkasından arama butonuna basılır.
    cy.get('.sc-16f24a25-0 > .type_0').click();
    cy.get('.ADULT > .controls > .minus > .sc-79b0dd48-0').click();
    cy.get('.CHILD > .controls > .plus > .sc-79b0dd48-0').click();
    cy.get('[data-testid="childAge-1"]').select('5');
    cy.get('.btn-group > .btn').click();
    cy.get('.search-btn-group > .btn').click();

    //Arama sonuçta "Test App Hotel" tesisinin fiyat ve ZPara tutar bilgisi alınır.
    console.log('Otelz.com açildi ve TestApp Hotel için filtreleme yapildi');
    cy.get('.price').invoke('text').then((Tfiyat) => { //₺ 500
      console.log('Tfiyat:', Tfiyat);
      cy.wrap(Tfiyat).as('Tfiyat')
    });

    cy.get('[data-testid="zpara"]').invoke('text').then((zpara) => { //₺ 25 Zpara
      console.log('Zpara:', zpara);  // Fiyatı konsola yazdır
      cy.wrap(zpara).as('Zpara');  // Değeri bir alias olarak sakla
    });

   
    //Kişi sayısı, çocuk sayısı tesis kartında kontrol edilip rezervasyon yap butonuna tıklanır 
    cy.get('.right-col > .rooms').should('contain.text', '1 yetişkin, 1 çocuk');
    
    //cypress yeni sekmeye gecmeyi desteklemez. aynı sekmeden acılmasını sagladık.
    cy.get('.right-col > .btn').should('have.attr', 'target', '_blank').then((button) => {
    const url = button.prop('href');
    cy.wrap(url).as('newPageUrl');
    cy.wrap(button).invoke('removeAttr', 'target').click();
      });

        cy.get('@newPageUrl').then((url) => {
        cy.visit(url);
        cy.wait(2000);
        cy.get('.room-detail').scrollIntoView();
        cy.wait(3000);
        //Tesis detay sayfasında fiyat ve zpara tutarları doğrulanır.
        cy.get('div#roomPrices div.web-price > div.net-price').should('contain', '₺ 500');
        cy.get('.right > .sc-9d0f44b0-0 > [style="display: block;"] > div').should('contain', '25');

        //alt oda seçenekleri alanındaki selectbox dan bir oda seçilir ve rezervasyon yap butonuna tıklanır.
        cy.get('div#rooms div:nth-child(1) > div.col-1.select > div > select').select('1');
        cy.get('#totalPrice > .btn').click();

        //Rezervasyon 1. sayfasında kişi bilgileri girilir, sağ alanda fiyat kontrol edilir 
        //ve aydınlatma metni checkbox işaretlenip kaydet butonu ile devam edilir
        cy.get('.wrapper > :nth-child(1) > :nth-child(1) > input').type('Ayse');
        cy.get('.wrapper > :nth-child(1) > :nth-child(2) > input').type('YAVAS')
        cy.get('[data-testid="customerInfo.email"]') .type('b@b.com');
        cy.get('#phoneInput').type('5553334455');

        cy.get('@Tfiyat').then((Tfiyat) => {
          cy.get('.price').should('contain',Tfiyat);
        });
        
        cy.get(':nth-child(1) > .sc-7ad7fe-0 > .input-wrapper > [data-testid="test"]').click();
        cy.get('.button-wrapper > .btn').click();

         //Rezervasyon 2. sayfasında fiyat doğrulanır ve "Online Ödeme" seçeneği olduğu kontrol edilir.
         //cy.wait(2000);
         cy.get(':nth-child(7) > .type > .row').should('be.visible');

         cy.get('@Tfiyat').then((Tfiyat) => {
          cy.get('.total-price > .price').should('contain',Tfiyat);
        });
           
    });    
    
});
});