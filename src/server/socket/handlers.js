const RoomManager = require('./RoomManager')

const roomManager = RoomManager()

function makeHandleEvent() {

  function handleEvent(roomName, createEntry) {
    const user = 'test user'
    const room = roomManager.getRoomByName(roomName)
    const entry = { user, ...createEntry() };
    room.addEntry(entry)
    room.broadcastMessage({ chat: roomName, ...entry })
    return room;
  }

  return handleEvent;
}

module.exports = (client, clientManager, roomManager) => {
  const handleEvent = makeHandleEvent(client, clientManager, roomManager);

  function handleJoin(roomName, callback) {
    console.log('handling join to', roomName);
    const createEntry = () => ({ event: `joined ${roomName}` });
    const room = handleEvent(roomName, createEntry)
    room.addUser(client);
    callback(room.getChatHistory());
  }

  function handleLeave(roomName, callback) {
    const createEntry = () => ({ event: `left ${roomName}` });
    const room = handleEvent(roomName, createEntry)
    room.removeUser(client.id);
    callback(null);
  }

  function handleMessage({ roomName, message } = {}, callback) {
    const createEntry = () => ({ message });
    handleEvent(roomName, createEntry)
  }

  function handleGetRooms(_, callback) {
    return callback(null, roomManager.serializeRooms());
  }

  function handleDisconnect() {
    clientManager.removeClient(client);
    roomManager.removeClient(client);
  }

  function handleReady(roomName) {
    const room = roomManager.getRoomByName(roomName);
    room.broadcastSong();
  }

  function handleQueueUpdate({ roomName, queue } = {}) {
    const room = roomManager.getRoomByName(roomName)
    const ParsedQueueArray = JSON.parse(queue);
    room.queue(ParsedQueueArray);
  }

  return {
    handleJoin,
    handleLeave,
    handleMessage,
    handleGetRooms,
    handleDisconnect,
    handleReady,
    handleQueueUpdate
  };
};
