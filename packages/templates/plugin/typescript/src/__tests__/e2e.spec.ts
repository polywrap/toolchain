import { Web3ApiClient } from "@polywrap/client-js";
import { samplePlugin } from "../";

describe("e2e", () => {

  let client: Web3ApiClient;
  const uri = "ens/sampleplugin.eth";

  beforeAll(() => {
    // Add the samplePlugin to the Web3ApiClient
    client = new Web3ApiClient({
      plugins: [
        {
          uri: uri,
          plugin: samplePlugin({
            defaultValue: "foo bar"
          })
        }
      ]
    });
  });

  it("sampleMethod", async () => {
    const result = await client.invoke({
      uri,
      method: "sampleMethod",
      input: {
        data: "fuz baz "
      },
    });

    expect(result.error).toBeFalsy();
    expect(result.data).toBeTruthy();
    expect(result.data).toBe("fuz baz foo bar");
  });
});
