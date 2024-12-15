import Api from "./Api";

describe("Api", () => {
    describe("getListings", () => {
        it("works", async () => {
            let res = await Api.getListings();
            expect(res).toEqual({listings: []});
        })
    })
})