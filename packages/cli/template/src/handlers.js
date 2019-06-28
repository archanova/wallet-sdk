/**
 * GET /
 * @returns {IGetResponse}
 */
function get() {
  return {
    name: '${app.name}',
    alias: '${app.alias}',
    version: '${app.version}',
    description: '${app.description}',
  };
}

/**
 * POST /
 * @param body IPostBody
 * @returns {Promise<IPostResponse>}
 */
async function post(body) {
  const {
    player,
    nextData,
    nextTime,
    previousData,
    previousTime,
    now,
  } = body;

  let whoseTurn = null;
  let winner = null;

  // initial move
  if (!player) {
    whoseTurn = 'Opponent';
  } else {

    switch (player) {
      case 'Creator':
        if (nextData === '0x01') {
          winner = 'Creator';
        } else {
          whoseTurn = 'Opponent';
        }
        break;

      case 'Opponent':
        if (nextData === '0x01') {
          winner = 'Opponent';
        } else {
          whoseTurn = 'Creator';
        }
        break;
    }
  }

  return {
    whoseTurn,
    winner,
  };
}

module.exports = {
  get,
  post,
};
