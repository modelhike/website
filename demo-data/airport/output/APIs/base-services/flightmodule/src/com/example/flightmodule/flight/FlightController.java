package com.example.flightmodule.flight;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import reactor.core.publisher.*;
import org.reactivestreams.Publisher;
import java.util.Date;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SubscriptionMapping;
import org.springframework.stereotype.Controller;
import com.example.flightmodule.flight.model.*;
import com.example.flightmodule.flight.crud.*;

@Controller
public class FlightController {
  private static final Logger LOG = LoggerFactory.getLogger(FlightController.class);
  @Autowired
  ApplicationContext ctx;

  @Autowired
  ObjectMapper mapper;

  @QueryMapping("listFlightsByArrivalStation")
  public Flux<Flight> listFlightsByArrivalStation(@Argument Reference arrivalStation) {
      var cmd = ctx.getBean(listFlightsByArrivalStationQuery.class);
      return cmd.run(arrivalStation);
  }

  @MutationMapping("addFlight")
  public Mono<Flight> createFlight(@Argument("input") FlightInput payload) {
      var entity = mapper.convertValue(payload, Flight.class);
      var cmd = ctx.getBean(CreateFlightCommand.class);
      var returnValue  =  cmd.run(Mono.just(entity));
      flightStream.next(entity);
      return returnValue;
  }

  @MutationMapping("deleteFlight")
  public Mono<Void> deleteFlight(@Argument("_id") String id) {
      var cmd = ctx.getBean(DeleteFlightCommand.class);
      return cmd.run(id);
  }

  @QueryMapping("listFlights")
  public Flux<Flight> listFlights() {
      var cmd = ctx.getBean(ListFlightsQuery.class);
      return cmd.run();
  }

  @QueryMapping("getFlightById")
  public Mono<Flight> getFlightById(@Argument("_id") String id) {
      var cmd = ctx.getBean(GetFlightByIdQuery.class);
      return cmd.run(id);
  }

}
