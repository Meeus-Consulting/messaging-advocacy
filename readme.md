# Oh hello you

So this is a very basic example of Pub Sub that shows how conventions can work to build relatively simple binding structures, mimicking more
modern topic binding implementations in the cloud.

The main conventions are:

1. Every _publisher_ has a single topic exchange for _Outbound messages_
2. Every _subscriber_ has a single topic exchange for _Inbound messages_
3. A _subscription_ between services is represented in effect by a _binding_ between the publisher exchange and the subscriber exchange.
   1. This binding defines the routing key as `#`, which means give me all of your stuff
4. A _subscriber_ subscribes to event types from an _publisher_
   1. Every subscription to an event is represented by the existence of an inbound queue for that event.
   2. Every subscription to an event is represented by the binding between the inbound event queue and the subscriber exchange
   3. Every binding between the inbound event type queue and the subscriber exchange has a routing key denoting the event type

Out of scope:

- Dead-lettering
  - This is easily set up via the API but out of scope for clarity
- Retries
  - This is a harder task, and would require a worker or client-side implementation
- Handlers
  - Too many opinionated frameworks that ship with their own handlers for queues. Best to leave this library to be a reference for a convention based approach
- Outbox pattern
  - Not even going there, that's an entirely different kettle of fish

## Prerequisites

1. Make
2. Docker and Docker Compose
3. yarn

## Getting up and running

```
yarn
make up
make start
```

`yarn` will obviously install all the gubbins you need  
`make up` will start a rabbitmq instance with the management console on the default ports - `5672` for rabbit itself, and `15672` for the ui  
`make start` will spin up several applications - a users service, a facebook service and a pinterest service.

The user service is the publisher, and exposes a simple API endpoint to create and consume invitations.
The facebook and pinterest services subscribe to a subset of event types published by the user service.

To send an invitation:

```
curl --location --request POST 'http://localhost:5000/invitations' \
--header 'Content-Type: application/json' \
--data-raw '{
    "company_id": "4aaec88a-c130-4e94-87b8-eb6cb391cca6",
    "user_id": "36bb3076-852c-4042-b5ec-bbfd33ca6e93"
}'
```

There are no uniqueness checks at all, so this will always publish a new event.

## Useful tidbits

Just one, for now. You can run `make ui` to open the RabbitMQ management console.

🎉
