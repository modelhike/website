package com.example.flightmodule.station;
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
import com.example.flightmodule.station.model.*;
import com.example.flightmodule.station.crud.*;

@Controller
public class StationController {
  private static final Logger LOG = LoggerFactory.getLogger(StationController.class);
  @Autowired
  ApplicationContext ctx;

  @Autowired
  ObjectMapper mapper;

  @MutationMapping("addStation")
  public Mono<Station> createStation(@Argument("input") StationInput payload) {
      var entity = mapper.convertValue(payload, Station.class);
      var cmd = ctx.getBean(CreateStationCommand.class);
      var returnValue  =  cmd.run(Mono.just(entity));
      stationStream.next(entity);
      return returnValue;
  }

  @MutationMapping("updateStation")
  public Mono<Station> updateStation(@Argument("input") StationInput payload) {
      var entity = mapper.convertValue(payload, Station.class);
      var cmd = ctx.getBean(UpdateStationCommand.class);
      return cmd.run(Mono.just(entity));
  }

  @MutationMapping("deleteStation")
  public Mono<Void> deleteStation(@Argument("_id") String id) {
      var cmd = ctx.getBean(DeleteStationCommand.class);
      return cmd.run(id);
  }

  @QueryMapping("getStationById")
  public Mono<Station> getStationById(@Argument("_id") String id) {
      var cmd = ctx.getBean(GetStationByIdQuery.class);
      return cmd.run(id);
  }

  @QueryMapping("listStations")
  public Flux<Station> listStations() {
      var cmd = ctx.getBean(ListStationsQuery.class);
      return cmd.run();
  }

}
