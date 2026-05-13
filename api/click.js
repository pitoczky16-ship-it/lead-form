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
          "Cookie": ".ASPXAUTH=TVOJ_COOKIE"
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
