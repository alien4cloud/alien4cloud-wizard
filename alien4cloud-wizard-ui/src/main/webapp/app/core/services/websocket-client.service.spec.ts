import { TestBed } from '@angular/core/testing';

import { WebsocketClientService } from './websocket-client.service';

describe('WebsocketClientService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebsocketClientService = TestBed.get(WebsocketClientService);
    expect(service).toBeTruthy();
  });
});
