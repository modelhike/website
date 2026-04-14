package com.example.flightmodule.flight.crud;

import static java.util.logging.Level.FINE;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import reactor.core.publisher.Mono;
import org.springframework.stereotype.Component;
import com.example.flightmodule.flight.model.*;

@Component
public class CreateFlightCommand {

  private static final Logger LOG = LoggerFactory.getLogger(CreateFlightCommand.class);

  private final FlightRepository repository;

  @Autowired
  public CreateFlightCommand(FlightRepository repository) {
    this.repository = repository;
  }

  public Mono<Flight> run(Mono<Flight> input) {

    return input.flatMap(repository :: insert);
  }

}
