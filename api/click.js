export default async function handler(req, res) {

  const { lead_id, type, redirect } = req.query;

  console.log("CLICK TRACKED:", {
    lead_id,
    type,
    redirect
  });

  // scoring rules
  let score = 0;

  switch (type) {

    case "pricing":
      score = 4;
      break;

    case "demo":
      score = 7;
      break;

    case "calendar":
      score = 10;
      break;

    default:
      score = 1;
  }

  try {

    // 1. načítaj lead z Creatio
    const leadResponse = await fetch(
      `https://11010104-demo.creatio.com/0/odata/Lead(guid'${lead_id}')`,
      {
        headers: {
          "Content-Type": "application/json",
          "Cookie": ".ASPXAUTH=05B234B40B1DE9E65B301D02588E5E5105FB09302AB7C112132301F7401D8A10CD520C0B659AAC6F33FFA04EBC93E7002B27E50342E8ABBC6D053BB7FFE31661202E327FAE76167D41B453A65E47021524AAB0E3541F7DEAEDEE035A36A0C8D9E9B1C1EA038116F19ACDD041C12F04C22667DBF7C1567D7FC70A906BA163A0F9E13C8AD160EFFFA774B4C29B1F3B7510155C0FEE4D578EE38A7D37DCA4DAEFB7793919FC74968222447EFE9CAA8E7FA74111306386996CFA25656E980ED7CDC3ABCECDDFAEF4E8BB0E6BFFDE7685D91CB0CFF6D3ABB9A136C66C79ADBAE2230BA1212D7D78F901E7712CD0EE455C9DA2837A31CE53436528D923B569CFB48F6EB758B82F85E7E3723467ECC3E7669FEB6CB6D595FDA12D159D6989B01B8F511F6F99C143268D3FC4B7DE9118A4A9B957B85D56FB3550F3A73CAB2E7C1E0C5CEDB61643043C216F52D93DC7B02A8EAE85063751E7433F718722D9AD3D5A8E9139F991E29DA63132BF6517A511BA70912D176A44FB32807591C53836A6D8F2B24D4CA87E1A9A59EFABD89C055B0279FD646C000EE239B2C54ADCDFE571444D5FE862ACB14C40C5D3F2E16B3FD59A03E830FE8260C1C165F8937D382BCD1803EA644816F5E932006381B64B1DDB3B2354E8972F87377910259E85ED8A5C25559125A14F5F80571FF24BAF155992265D6268BC6BC19B7A5CBAAADBEED13F500AAB5649FBB0328DCB0A2141027629A79D8F0A9B0F5D70EF2655B61B17EE2546954B78A25C31DC45164264B8A50AABC1E0CB127591E462"
        }
      }
    );

    const lead = await leadResponse.json();

    const currentScore = lead.UsrLeadScore || 0;

    const updatedScore = currentScore + score;

    // 2. update lead score
    await fetch(
      `https://11010104-demo.creatio.com/0/odata/Lead(guid'${lead_id}')`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Cookie": ".ASPXAUTH=TVOJ_COOKIE"
        },
        body: JSON.stringify({
          UsrLeadScore: updatedScore
        })
      }
    );

    console.log("NEW SCORE:", updatedScore);

  } catch (e) {

    console.error(e);

  }

  // redirect user
  res.redirect(redirect || "/");
}
